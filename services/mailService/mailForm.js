import nodemailer from "nodemailer";
const sendEmail = async (Options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email_Username,
      pass: process.env.email_Password,
    },
  });

  const mailOptions = {
    from: "social media <AkhtarlyCompany@gmail.com>", //#Todo will be modified
    to: Options.email,
    subject: Options.subject,
    text: Options.text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
