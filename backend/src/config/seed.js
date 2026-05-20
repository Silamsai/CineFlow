require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Show = require('../models/Show');
const User = require('../models/User');
const logger = require('../utils/logger');

const MOCK_MOVIES = [
  { title: 'KGF: Chapter 3', posterUrl: 'https://picsum.photos/seed/kgf3/300/450', genre: ['Action', 'Drama'], format: ['2D', 'IMAX', '4DX'], language: ['Kannada', 'Hindi', 'Telugu', 'Tamil'], certificate: 'UA', averageRating: 9.1, totalReviews: 24800, duration: 175, director: 'Prashanth Neel', description: 'The third chapter in the epic KGF saga continues the story of Rocky Bhai as he faces new enemies and battles for supremacy.', cast: ['Yash', 'Srinidhi Shetty', 'Sanjay Dutt', 'Raveena Tandon'], tags: ['blockbuster', 'action', 'epic'], releaseDate: new Date(), isNew: true, isHot: false },
  { title: 'Pushpa 3: The Rule', posterUrl: 'https://picsum.photos/seed/pushpa3/300/450', genre: ['Action', 'Thriller'], format: ['2D', '4DX'], language: ['Telugu', 'Hindi', 'Tamil'], certificate: 'UA', averageRating: 8.8, totalReviews: 31200, duration: 190, director: 'Sukumar', description: 'Pushpa Raj returns stronger than ever as he fights to protect his empire while facing the most dangerous threat yet.', cast: ['Allu Arjun', 'Rashmika Mandanna', 'Fahadh Faasil'], tags: ['action', 'south', 'trending'], releaseDate: new Date(), isNew: false, isHot: true },
  { title: 'Kalki 2898 AD', posterUrl: 'https://picsum.photos/seed/kalki/300/450', genre: ['Sci-Fi', 'Action', 'Mythology'], format: ['2D', 'IMAX'], language: ['Telugu', 'Hindi', 'Tamil', 'Malayalam'], certificate: 'UA', averageRating: 8.5, totalReviews: 18900, duration: 180, director: 'Nag Ashwin', description: 'A futuristic sci-fi saga set in the year 2898 AD, blending mythology and technology.', cast: ['Prabhas', 'Deepika Padukone', 'Amitabh Bachchan'], tags: ['sci-fi', 'epic'], releaseDate: new Date(), isNew: false, isHot: true },
  { title: 'Avengers: Doomsday', posterUrl: 'https://picsum.photos/seed/avengers/300/450', genre: ['Action', 'Sci-Fi', 'Adventure'], format: ['2D', 'IMAX', '4DX', '3D'], language: ['English', 'Hindi', 'Tamil', 'Telugu'], certificate: 'UA', averageRating: 9.3, totalReviews: 52100, duration: 170, director: 'Russo Brothers', description: 'The Avengers face their greatest threat as Doctor Doom rises to destroy the multiverse.', cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson', 'Pedro Pascal'], tags: ['hollywood', 'marvel', 'featured'], releaseDate: new Date(), isNew: true, isHot: true },
  { title: 'Stree 3', posterUrl: 'https://picsum.photos/seed/stree3/300/450', genre: ['Horror', 'Comedy'], format: ['2D'], language: ['Hindi'], certificate: 'UA', averageRating: 8.2, totalReviews: 11400, duration: 145, director: 'Amar Kaushik', description: 'The beloved horror-comedy franchise returns with a brand new supernatural adventure in Chanderi.', cast: ['Rajkummar Rao', 'Shraddha Kapoor', 'Aparshakti Khurana'], tags: ['horror', 'comedy', 'bollywood'], releaseDate: new Date(), isNew: true, isHot: false },
  { title: 'RRR 2', posterUrl: 'https://picsum.photos/seed/rrr2/300/450', genre: ['Action', 'Drama', 'Historical'], format: ['2D', 'IMAX'], language: ['Telugu', 'Hindi', 'Tamil'], certificate: 'UA', averageRating: 9.0, totalReviews: 28700, duration: 185, director: 'S.S. Rajamouli', description: "The sequel to the global blockbuster RRR, following the next chapter of Raju and Bheem's story.", cast: ['Ram Charan', 'NTR Jr.', 'Alia Bhatt', 'Ajay Devgn'], tags: ['epic', 'action'], releaseDate: new Date(), isNew: false, isHot: true },
  { title: 'Jawan 2', posterUrl: 'https://picsum.photos/seed/jawan2/300/450', genre: ['Action', 'Thriller'], format: ['2D', '4DX'], language: ['Hindi', 'Tamil', 'Telugu'], certificate: 'UA', averageRating: 7.9, totalReviews: 15600, duration: 155, director: 'Atlee', description: "The action-packed sequel continues Vikram Rathore's mission to bring justice.", cast: ['Shah Rukh Khan', 'Deepika Padukone', 'Nayanthara'], tags: ['srk', 'action'], releaseDate: new Date(), isNew: false, isHot: false },
  { title: 'Fighter 2', posterUrl: 'https://picsum.photos/seed/fighter2/300/450', genre: ['Action', 'War'], format: ['2D', 'IMAX'], language: ['Hindi'], certificate: 'UA', averageRating: 7.6, totalReviews: 9800, duration: 150, director: 'Siddharth Anand', description: "India's air force takes on its deadliest mission yet in this high-octane aerial action sequel.", cast: ['Hrithik Roshan', 'Deepika Padukone', 'Anil Kapoor'], tags: ['action', 'aerial'], releaseDate: new Date(), isNew: true, isHot: false },
  { title: 'Singham Again 2', posterUrl: 'https://picsum.photos/seed/singham2/300/450', genre: ['Action', 'Drama'], format: ['2D'], language: ['Hindi'], certificate: 'UA', averageRating: 0.0, totalReviews: 0, duration: 150, director: 'Rohit Shetty', description: 'The cop universe expands with the next high-octane installment of Singham.', cast: ['Ajay Devgn', 'Kareena Kapoor', 'Ranveer Singh'], tags: ['action', 'cop-universe'], releaseDate: new Date('2026-06-15'), isNew: false, isHot: false, isComingSoon: true },
  { title: 'Brahmastra Part 2', posterUrl: 'https://picsum.photos/seed/brahmastra2/300/450', genre: ['Fantasy', 'Adventure'], format: ['2D', '3D'], language: ['Hindi', 'Telugu'], certificate: 'UA', averageRating: 0.0, totalReviews: 0, duration: 165, director: 'Ayan Mukerji', description: 'The saga of the Astras continues with Dev as the primary force.', cast: ['Ranbir Kapoor', 'Alia Bhatt', 'Ranveer Singh'], tags: ['fantasy', 'mythology'], releaseDate: new Date('2026-07-20'), isNew: false, isHot: false, isComingSoon: true },
  { title: 'Don 3', posterUrl: 'https://picsum.photos/seed/don3/300/450', genre: ['Action', 'Thriller'], format: ['2D'], language: ['Hindi'], certificate: 'UA', averageRating: 0.0, totalReviews: 0, duration: 140, director: 'Farhan Akhtar', description: 'A new era of the Don begins as a new criminal mastermind takes the reigns.', cast: ['Ranveer Singh', 'Kiara Advani'], tags: ['action', 'thriller'], releaseDate: new Date('2026-08-10'), isNew: false, isHot: false, isComingSoon: true }
];

const generateSeatLayout = (rows = 10, cols = 12) => {
  const layout = [];
  for (let r = 0; r < rows; r++) {
    const rowLayout = [];
    for (let c = 0; c < cols; c++) {
      if (r < 3) rowLayout.push('standard');
      else if (r < 7) rowLayout.push('premium');
      else rowLayout.push('vip');
    }
    layout.push(rowLayout);
  }
  return layout;
};

const THEATERS = [
  // Mumbai
  {
    name: 'PVR IMAX Infiniti',
    location: 'Infiniti Mall, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    latitude: 19.1413,
    longitude: 72.8315,
    amenities: ['Parking', 'Food Court', 'Recliners', 'IMAX Screen'],
    screens: [
      { name: 'Audi 1 (IMAX)', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 300, premium: 400, vip: 580 } },
      { name: 'Audi 2', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 180, premium: 280, vip: 450 } }
    ]
  },
  {
    name: 'INOX Megaplex',
    location: 'Inorbit Mall, Malad West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400064',
    latitude: 19.1725,
    longitude: 72.8354,
    amenities: ['Parking', 'Food Court', 'Valet', '4DX Screen'],
    screens: [
      { name: 'Audi 1 (4DX)', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 320, premium: 420, vip: 600 } },
      { name: 'Audi 2 (IMAX)', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 280, premium: 380, vip: 550 } }
    ]
  },
  {
    name: 'Cinepolis VIP',
    location: 'Viviana Mall, Thane West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400606',
    latitude: 19.2081,
    longitude: 72.9712,
    amenities: ['VIP Lounge', 'Recliners', 'Service on Seat', 'Dolby Atmos'],
    screens: [
      { name: 'VIP Screen 1', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 350, premium: 450, vip: 620 } }
    ]
  },
  // Delhi NCR
  {
    name: 'PVR Director’s Cut',
    location: 'Ambience Mall, Vasant Kunj',
    city: 'Delhi NCR',
    state: 'Delhi',
    pincode: '110070',
    latitude: 28.5415,
    longitude: 77.1554,
    amenities: ['Parking', 'VIP Lounge', 'Recliners', 'Dolby Atmos'],
    screens: [
      { name: 'Audi 1 (Dolby)', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 350, premium: 450, vip: 620 } }
    ]
  },
  {
    name: 'Delite Cinema',
    location: 'Asaf Ali Road, Daryaganj',
    city: 'Delhi NCR',
    state: 'Delhi',
    pincode: '110002',
    latitude: 28.6385,
    longitude: 77.2372,
    amenities: ['Parking', 'Heritage Design', 'Food Court'],
    screens: [
      { name: 'Main Screen', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 150, premium: 220, vip: 350 } }
    ]
  },
  // Bangalore
  {
    name: 'PVR Superplex Forum Mall',
    location: 'Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560095',
    latitude: 12.9345,
    longitude: 77.6112,
    amenities: ['Parking', 'IMAX Screen', 'Recliners'],
    screens: [
      { name: 'Audi 1 (IMAX)', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 320, premium: 420, vip: 600 } }
    ]
  },
  {
    name: 'Cinepolis Orion Mall',
    location: 'Rajajinagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560055',
    latitude: 12.9715,
    longitude: 77.5946,
    amenities: ['Parking', 'VIP Lounge', 'Dolby Atmos'],
    screens: [
      { name: 'Audi 1 (VIP)', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 300, premium: 400, vip: 580 } }
    ]
  },
  // Hyderabad
  {
    name: 'Prasad Multiplex',
    location: 'NTR Gardens',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500063',
    latitude: 17.4156,
    longitude: 78.4748,
    amenities: ['Large Screen', 'Parking', 'Food Court'],
    screens: [
      { name: 'Large Screen 1', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 250, premium: 350, vip: 500 } }
    ]
  },
  {
    name: 'PVR Next Galleria',
    location: 'Panjagutta',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500082',
    latitude: 17.4258,
    longitude: 78.4512,
    amenities: ['Parking', '4DX Screen', 'Food Court'],
    screens: [
      { name: 'Audi 1 (4DX)', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 300, premium: 400, vip: 580 } }
    ]
  },
  // Chennai
  {
    name: 'Sathyam Cinemas',
    location: 'Royapettah',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600014',
    latitude: 13.0524,
    longitude: 80.2587,
    amenities: ['Parking', 'Legendary Popcorn', 'Dolby Atmos'],
    screens: [
      { name: 'Sathyam Screen', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 200, premium: 300, vip: 450 } }
    ]
  },
  // Pune
  {
    name: 'Cinepolis Seasons Mall',
    location: 'Hadapsar',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411028',
    latitude: 18.5204,
    longitude: 73.8567,
    amenities: ['Parking', 'Food Court', 'VIP Screen'],
    screens: [
      { name: 'Audi 1', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 180, premium: 280, vip: 420 } }
    ]
  },
  // Kolkata
  {
    name: 'PVR Mani Square',
    location: 'Kankurgachi',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700054',
    latitude: 22.5726,
    longitude: 88.3639,
    amenities: ['Parking', 'IMAX Screen', 'Recliners'],
    screens: [
      { name: 'Audi 1 (IMAX)', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 280, premium: 380, vip: 550 } }
    ]
  },
  // Kochi
  {
    name: 'PVR Lulu Mall',
    location: 'Edappally',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682024',
    latitude: 9.9816,
    longitude: 76.2999,
    amenities: ['Parking', 'Food Court', 'Dolby Atmos'],
    screens: [
      { name: 'Audi 1 (Dolby)', totalSeats: 120, rows: 10, columns: 12, seatLayout: generateSeatLayout(10, 12), pricing: { standard: 220, premium: 320, vip: 480 } }
    ]
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in env variables');
    }

    logger.info('Connecting to database...');
    await mongoose.connect(mongoUri);
    logger.info('Connected to database!');

    // Clear existing
    logger.info('Clearing old collections...');
    try { await Movie.collection.drop(); } catch (e) {}
    try { await Theater.collection.drop(); } catch (e) {}
    try { await Show.collection.drop(); } catch (e) {}
    await User.deleteMany({ email: 'admin@cineflow.com' });

    // Seed Admin User
    logger.info('Seeding admin user...');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await User.create({
      email: 'admin@cineflow.com',
      password: hashedPassword,
      firstName: 'CineFlow',
      lastName: 'Admin',
      isAdmin: true,
    });
    logger.info('Admin user seeded: admin@cineflow.com / Admin@123');

    // Seed Movies
    logger.info('Seeding movies...');
    const insertedMovies = await Movie.insertMany(MOCK_MOVIES);
    logger.info(`Seeded ${insertedMovies.length} movies.`);

    // Seed Theaters
    logger.info('Seeding theaters...');
    const insertedTheaters = await Theater.insertMany(THEATERS);
    logger.info(`Seeded ${insertedTheaters.length} theaters.`);

    // Seed Shows
    logger.info('Seeding shows...');
    const shows = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 3; i++) { // Next 3 days
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      for (const movie of insertedMovies) {
        if (movie.isComingSoon) continue;
        const languages = movie.language && movie.language.length > 0 ? movie.language : ['Hindi'];
        // Let's create a couple of shows per movie per theater
        for (const theater of insertedTheaters) {
          const screen = theater.screens[0];
          const formats = movie.format.filter(f => screen.name.includes(f) || f === '2D');
          const format = formats[0] || '2D';

          // Show times: 10:00 AM, 2:00 PM, 6:00 PM, 9:30 PM
          const showHours = [10, 14, 18, 21.5];
          showHours.forEach((hour, hourIdx) => {
            const language = languages[hourIdx % languages.length];
            const showTime = new Date(currentDate);
            showTime.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);

            const endTime = new Date(showTime);
            endTime.setMinutes(showTime.getMinutes() + movie.duration);

            const seatStatus = Array(screen.rows).fill(null).map(() => Array(screen.columns).fill('available'));

            shows.push({
              movieId: movie._id,
              theaterId: theater._id,
              screenId: screen._id,
              screenName: screen.name,
              showTime,
              endTime,
              format,
              language,
              totalSeats: screen.totalSeats,
              availableSeats: screen.totalSeats,
              pricing: screen.pricing,
              seatStatus,
              heldSeats: [],
            });
          });
        }
      }
    }

    const insertedShows = await Show.insertMany(shows);
    logger.info(`Seeded ${insertedShows.length} shows.`);

    logger.info('🎉 Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
