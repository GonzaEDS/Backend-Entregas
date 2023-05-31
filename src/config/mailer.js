import nodemailer from 'nodemailer'

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
      }
    })
  }

  async sendMail(to, subject, title, content) {
    const html = `<h1 class="display-1">${title}</h1>
    <p class="fs-1">${content}</p>`
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to,
      subject,
      html
    }

    try {
      const info = await this.transporter.sendMail(mailOptions)
      console.log('Email sent: ' + info.response)
    } catch (error) {
      console.log(error)
    }
  }
}

export default new Mailer()
