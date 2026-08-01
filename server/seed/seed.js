const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Opportunity = require('../models/Opportunity');
const opportunities = require('./opportunities');

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();
    await Opportunity.deleteMany();
    await Opportunity.insertMany(opportunities);
    console.log(`Seeded ${opportunities.length} opportunities`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runSeed();