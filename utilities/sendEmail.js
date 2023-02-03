const ejs = require("ejs");
const nodemailer = require("nodemailer");
const ExpressError = require("./expresserror.js");
const User = require("../models/user.js");

const hostEmail = process.env.EMAIL_HOST;
const senderName = process.env.EMAIL_SENDER_NAME;
const senderEmail = process.env.EMAIL_SENDER_EMAIL;
const senderEmailPassword = process.env.EMAIL_SENDER_PASSWORD;

const sendRecoveryEmail = async function (userID, recoveryLink) {
  let matchingUser = await User.findById(userID);
  let from = senderName;
  let selectedEmail = process.env.NODE_ENV !== "production" ? process.env.EMAIL_RECEIVER_EMAIL : matchingUser.email;
  let subject = "Password recovery";
  let attachement = null;
  // let attachement = [{
  //   filename: `someAttachementName.pdf`,
  //   path: `./reports/reportsGenerated/someAttachementName.pdf`
  // }]
  let emailBody = await ejs.renderFile("./emails/recoveryEmail.ejs", {
    recoveryLink: recoveryLink,
  });

  const send = async function () {
    let transporter = nodemailer.createTransport({
      host: hostEmail,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: senderEmail,
        pass: senderEmailPassword,
      },
    });

    let info = await transporter.sendMail({
      from: from, // sender address
      to: selectedEmail, // list of receivers
      subject: subject, // Subject line
      html: emailBody, // html body
      attachments: attachement,
    });
  };

  //   Nodemailer launch function
  try {
    await send();
    console.log(`* OK * An email with an account recovery link has been sent to the user [${userID}]`);
  } catch (error) {
    console.log(error);
    throw new ExpressError("Error sending email", 500);
  }
}

module.exports = {
  sendRecoveryEmail,
}