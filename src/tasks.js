import nodemailer from 'nodemailer'
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

function notifyFailedDeploy(err, stdout, stderr) {
  notifyViaEmail(
    '部署 xiayang.me 失败',
    `
  错误: ${err}
  输出错误： ${stderr}
  详细输出： ${stdout}
  时间： ${new Date()}
  `
  )
}

function notifySucceededDeploy() {
  notifyViaEmail(
    '部署 xiayang.me 成功',
    `
  时间： ${new Date()}
  `
  )
}

function log(...parameter) {
  console.log(...parameter)
}

function changeDirectory() {
  let directory = process.env.SITE_PATH || '~/code/site'
  return `cd ${directory} && `
}

function redeploySite() {
  const command =
    changeDirectory() +
    'git pull origin master && yarn build && pm2 restart xiayang.me'

  exec(command, function(error, stdout, stderr) {
    if (error) {
      notifyFailedDeploy(error, stdout, stderr)
      throw error
    } else {
      notifySucceededDeploy()
    }
  })
}

export { log, redeploySite }
