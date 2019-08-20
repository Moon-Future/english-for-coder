const nodemailer = require('nodemailer');
const { emailInfo } = require('../secret.js')

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true, // true for 465, false for other ports 587
  auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
  }
});

var mailOptions = {
  from: 'English4Coder <english4coder@163.com>', // sender address
  to: '236338364@qq.com', // list of receivers
  subject: 'English4Coder Verification Code', // Subject line
  // text: '有新注册用户', // plain text body
  // html: '<b>你好哟</b>' // html body
};

const sendMsg = {
  newUser: '有新的注册用户',
  email: 'Email',
  name: 'Name',
  website: 'Website',
  time: '时间',
  newArticle: '有新的文章',
  title: 'Title',
  content: 'Content'
}

mailOptions.text = 'Welcome to English4Code and look forward to your every progress and effort, your verification code is 666'

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
})

module.exports = {transporter, mailOptions, sendMsg};