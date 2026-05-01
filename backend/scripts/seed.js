const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const students = [
  { id: "S001", name: "Fahad Chowdhury" },
  { id: "S002", name: "Abdur Rouf" },
  { id: "S003", name: "Mubin Mohammed" },
  { id: "S004", name: "Ashraful Islam" },
  { id: "S005", name: "Nur Al Mumit" },
  { id: "S007", name: "Fahid" },
  { id: "S008", name: "Fujail Ahmed" },
  { id: "S009", name: "Moh.Foyez uddin Ahmed" },
  { id: "S010", name: "Abdul Awul Arman" },
  { id: "S012", name: "Mostafizur" },
  { id: "S013", name: "Shad Ahmed" },
  { id: "S015", name: "Shams" },
  { id: "S016", name: "Abul Kalam" },
  { id: "S017", name: "Allahrakha Mustak" },
  { id: "S018", name: "Zakir" },
  { id: "S019", name: "Anwar Ibn Arob" },
  { id: "S020", name: "Md Sadat Hussein Khan" },
  { id: "S021", name: "Mujibur Rahman" }
];

const seedStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    for (const student of students) {
      const email = `${student.id.toLowerCase()}@eshoquran.com`;
      
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        console.log(`User ${student.name} (${email}) already exists. Skipping.`);
        continue;
      }

      await User.create({
        name: student.name,
        email: email,
        password: 'password123', // Default password
        role: 'student'
      });
      console.log(`Seeded: ${student.name}`);
    }

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedStudents();
