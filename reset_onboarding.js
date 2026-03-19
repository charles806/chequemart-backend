import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import 'dotenv/config';

async function reset() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await User.updateOne(
    { email: 'seller@example.com' },
    { $set: { 'sellerInfo.onboardingComplete': false } }
  );
  console.log('Updated:', result);
  process.exit(0);
}

reset().catch(err => {
  console.error(err);
  process.exit(1);
});