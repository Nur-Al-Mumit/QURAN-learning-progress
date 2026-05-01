const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding admin...');

    const email = 'admin@eshoquran.com';
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('Admin already exists.');
      process.exit();
    }

    await User.create({
      name: 'Admin Teacher',
      email: email,
      password: 'adminpassword123',
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
