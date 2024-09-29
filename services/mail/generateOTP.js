function generateOTP() {
  const randomDigits = Math.floor(Math.random() * 1000000); // Generates a number between 0 and 999999

  const sixDigitNumber = String(randomDigits).padStart(6, "0");

  return sixDigitNumber.toString();
}

export default generateOTP;
