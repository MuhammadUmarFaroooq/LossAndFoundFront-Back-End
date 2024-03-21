const nodemailer = require("nodemailer");
exports.generateOTP = () => {
  let otp = "";
  for (let index = 0; index < 3; index++) {
    const ranVal = Math.round(Math.random() * 9);
    otp = otp + ranVal;
  }

  return otp;
};

exports.mailTransport = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

exports.generateHTMLWithOTP = (OTP) => {
  return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Item Sync</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing Item Sync. Use the following OTP to complete your Reset procedures. OTP is valid for 1 hour</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
      <p style="font-size:0.9em;">Regards,<br />Item Sync</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Item Sync</p>
        <p>Gujranwala,Punjab</p>
        <p>Pakistan</p>
      </div>
    </div>
  </div>`;
};
