import nodemailer from 'nodemailer'
import moment from 'moment'
import { exec } from 'child_process'

function notifyViaEmail(
  subject = 'Message',
  text = 'This is a mail.',
  to,
  from
) {
  let sender = from || process.env.NOTIFICATION_FROM || 'foo@bar.com'
  let receiver = to || process.env.NOTIFICATION_TO || 'foo@bar.com'
  let smtpUser = process.env.SMTP_USER || 'foo@bar.com'
  let smtpPassword = process.env.SMTP_PASSWORD || 'secret'

  let transporter = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPassword
    }
  })

  transporter.sendMail(
    {
      from: sender,
      to: receiver,
      subject: subject,
      text: text
    },
    (error, info) => {
      log(`Whoops.Something Wrong.`, error, info)
    }
  )
}

function notifyFailedDeploy(error, stdout, stderr) {
  notifyViaEmail(
    'xiayang.me 部署失败',
    `
  错误: ${error}
  输出错误： ${stderr}
  详细输出： ${stdout}
  时间： ${now()}
  `
  )
}

function notifySucceededDeploy(stdout) {
  notifyViaEmail(
    'xiayang.me 部署成功',
    `
  时间： ${now()}
  详细输出： ${stdout}
  `
  )
}

function log(...parameter) {
  console.log(...parameter)
}

function now() {
  moment.locale('zh-cn')
  return moment().format('LLLL')
}

function changeDirectory() {
  let directory = process.env.SITE_PATH || '~/code/site'
  return `cd ${directory}`
}

function yarnInstall() {
  return 'yarn'
}

function dependencyWasUpdated(payload) {
  let modified = payload.commits
    .map(commit => commit.modified)
    .reduce((previous, current) => {
      return previous.contact(current)
    })

  return modified.includes('package.json')
}

function redeploySite(payload) {
  let commands = [
    'git pull origin master',
    'yarn build',
    'pm2 restart xiayang.me'
  ]
  dependencyWasUpdated(payload) && commands.splice(1, 0, yarnInstall())
  commands.unshift(changeDirectory())

  exec(commands.join(' && '), function(error, stdout, stderr) {
    if (error) {
      notifyFailedDeploy(error, stdout, stderr)
      throw error
    } else {
      notifySucceededDeploy(stdout)
    }
  })
}

export { redeploySite }
