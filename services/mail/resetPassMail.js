import sendEmail from "./mailForm.js";

const resetPassMail = async (email, OTP) => {
  await sendEmail({
    email: email,
    subject: "Reset Password",
    text: `your verification code for your account is ${OTP}, this code will be expired in 10 minutes so hurry please!!`,
  });
};

export default resetPassMail;
