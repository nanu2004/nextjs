import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://naina:NXn0r9c93LdJa11h@cluster0.yrgvdrm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function dbConfig(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI, {
      
      bufferCommands: false,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process with failure
  }
}

export default dbConfig;
