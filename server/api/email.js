const nodemailer = require('nodemailer');
const { emailInfo } = require('../secret.js')
const account = emailInfo.account

const transporter = nodemailer.createTransport({
  // host: 'smtp.163.com',
  service: 'qq',
  port: 465,
  secure: true, // true for 465, false for other ports 587
  auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
  }
});

var mailOptions = {
  from: 'LeoChan <236338364@qq.com>', // sender address
  to: '236338364@qq.com', // list of receivers
  subject: 'English4Coder', // Subject line
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

module.exports = {transporter, mailOptions, sendMsg};