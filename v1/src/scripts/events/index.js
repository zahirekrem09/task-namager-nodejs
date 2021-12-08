const nodemailer = require('nodemailer');
const eventEmitter = require('./eventEmitter');

module.exports = () => {
  eventEmitter.on('send_mail', (data) => {
    console.log('send mail', data);
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD // generated ethereal password
      }
    });
    // send mail with defined transport object
    transporter
      .sendMail({
        from: process.env.EMAIL_FROM, // sender address
        ...data
      })
      .then((info) => console.log('Message sent: %s', info.messageId))
      .catch((err) => console.log('Error: %s', err));
  });
};
