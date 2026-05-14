const nodemailer = require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const sendContractEmail =
  async ({
    to,
    studentName,
    contractContent,
  }) => {
    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,
      to,
      subject:
        "Hợp đồng tư vấn du học",
      html: `
        <h2>Hợp đồng học sinh</h2>
        <p>Học sinh: <b>${studentName}</b></p>
        <div>${contractContent}</div>
      `,
    });
  };

module.exports = {
  sendContractEmail,
};