const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email verification function
const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - The Girl's Club",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DE5499;">Welcome to The Girl's Club!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" 
           style="background-color: #DE5499; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
        <p>Or copy this link: ${verificationUrl}</p>
        <p>This link expires in 24 hours.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { transporter, sendVerificationEmail };
