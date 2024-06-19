import { NextApiRequest, NextApiResponse } from 'next';
import dbConfig from '@utils/dbConfig';
import User from '@models/userModel';
import bcryptjs from 'bcryptjs';
import sendEmail from '@helpers/mailer';

// Connect to MongoDB
dbConfig();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    try {
      // Hash the password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      // Create a new user instance with hashed password
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      // Save the new user to the database
      const savedUser = await newUser.save();

      // Send verification email
      await sendEmail({ email, emailType: 'verification', userId: savedUser._id });

      // Respond with JSON
      res.status(201).json({
        message: 'User registered successfully',
        success: true,
        savedUser: {
          _id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
        },
      });
    } catch (error: any) {
      // Log the error to the console
      console.error(error);

      // Handle specific errors or log them
      if (error instanceof Error) {
        res.status(400).json({ success: false, error: error.message });
      } else {
        // Handle other types of errors
        res.status(400).json({ success: false, error: 'Unknown error occurred' });
      }
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
};

export default handler;