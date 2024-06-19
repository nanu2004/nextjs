import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs'; // Import bcryptjs for password hashing
import User from '@models/userModel'; // Adjust the path as per your folder structure

const APP_URL = process.env.APP_URL || 'http://localhost:3001'; // Use environment variable or fallback to default

interface SendEmailOptions {
  email: string;
  emailType: 'verification' | 'reset';
  userId: string;
}

async function sendEmail({ email, emailType, userId }: SendEmailOptions): Promise<void> {
  try {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io', // Replace with your SMTP host
      port: 2525, // Replace with your SMTP port
      auth: {
        user: '1f5336147de0be', // Replace with your SMTP username
        pass: 'yourpassword', // Replace with your SMTP password
      },
    });

    let subject = '';
    let htmlContent = '';

    if (emailType === 'verification') {
      // Generate verification token
      const verifyToken = await bcryptjs.hash(userId.toString(), 10);
      const verifyTokenExpiry = Date.now() + 3600000; // 1 hour from now

      // Update user with the hashed verification token and expiry
      await User.findByIdAndUpdate(userId, { verifyToken, verifyTokenExpiry });

      subject = 'Verify your email';
      htmlContent = `
        <p>Please verify your email using the following link:</p>
        <a href="${APP_URL}/verify/${verifyToken}">${APP_URL}/verify/${verifyToken}</a>
      `;
    } else if (emailType === 'reset') {
      // Generate reset token (hashing userId for demonstration)
      const resetToken = await bcryptjs.hash(userId.toString(), 10);
      await User.findByIdAndUpdate(userId, { resetToken });

      subject = 'Reset your password';
      htmlContent = `
        <p>Please reset your password using the following link:</p>
        <a href="${APP_URL}/reset/${resetToken}">${APP_URL}/reset/${resetToken}</a>
      `;
    } else {
      throw new Error('Invalid email type');
    }

    const mailOptions = {
      from: 'sender@example.com', // Replace with sender address
      to: email, // Replace with recipient's email
      subject: subject,
      html: htmlContent,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export default sendEmail;
