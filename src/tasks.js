import nodemailer from 'nodemailer'

function notifyViaEmail(
  from,
  to,
  subject = 'Message',
  text = 'This is a mail.'
) {
  let from = from || process.env.NOTIFICATION_FROM || 'foo@bar.com'
  let to = to || process.env.NOTIFICATION_TO || 'foo@bar.com'
  let transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
  })
  transporter.sendMail(
    {
      from: from,
      to: to,
      subject: subject,
      text: text
    },
    (error, info) => {
      console.log(`Whoops.Something Wrong, error: ${error},info: ${info}`)
    }
  )
}
