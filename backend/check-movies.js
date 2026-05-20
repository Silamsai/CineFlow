require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./src/models/Movie');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const movies = await Movie.find({});
  console.log("MOVIES IN DB:", movies.map(m => ({ id: m._id, title: m.title, posterUrl: m.posterUrl })));
  process.exit(0);
}
check().catch(console.error);
