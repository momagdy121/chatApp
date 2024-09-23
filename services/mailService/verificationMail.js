import sendEmail from "./mailForm.js";

const verificationMail = async (email, OTP) => {
  await sendEmail({
    email: email,
    subject: "Account verification",
    text: `your verification code for your account is ${OTP}, this code will be expired in 10 minutes so hurry please!!`,
  });
};
export default verificationMail;
