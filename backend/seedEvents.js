require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const User = require('./models/User');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the first user from database (the one you just registered)
    const user = await User.findOne();
    if (!user) {
      console.error('No user found in database. Please register first!');
      process.exit(1);
    }

    console.log(`Using organizer: ${user.name} (${user.email})`);

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    const sampleEvents = [
      {
        title: 'Tech Conference 2026',
        description: 'Join us for an exciting tech conference with industry leaders discussing the latest innovations in technology.',
        date: new Date('2026-04-15'),
        startTime: '09:00 AM',
        endTime: '06:00 PM',
        location: 'Bangalore, India',
        category: 'conference',
        price: 18,
        totalSeats: 500,
        availableSeats: 500,
        organizer: user._id,
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&h=400&fit=crop'
      },
      {
        title: 'Live Concert - Top Artists',
        description: 'Experience an unforgettable night of live music from world-class artists across multiple genres.',
        date: new Date('2026-05-20'),
        startTime: '07:00 PM',
        endTime: '11:00 PM',
        location: 'Mumbai, India',
        category: 'concert',
        price: 30,
        totalSeats: 5000,
        availableSeats: 5000,
        organizer: user._id,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&h=400&fit=crop'
      },
      {
        title: 'Business Networking Summit',
        description: 'Connect with entrepreneurs and business professionals in an exclusive networking environment.',
        date: new Date('2026-04-22'),
        startTime: '08:00 AM',
        endTime: '05:00 PM',
        location: 'New Delhi, India',
        category: 'conference',
        price: 24,
        totalSeats: 300,
        availableSeats: 300,
        organizer: user._id,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&h=400&fit=crop'
      },
      {
        title: 'Comedy Night Special',
        description: 'Laugh out loud with performances from top comedians in an intimate venue.',
        date: new Date('2026-04-18'),
        startTime: '08:00 PM',
        endTime: '10:30 PM',
        location: 'Pune, India',
        category: 'comedy',
        price: 12,
        totalSeats: 150,
        availableSeats: 150,
        organizer: user._id,
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1000&h=400&fit=crop'
      },
      {
        title: 'Theater: Modern Drama',
        description: 'Experience the finest theatrical performances with contemporary plays and classical drama.',
        date: new Date('2026-05-10'),
        startTime: '07:30 PM',
        endTime: '10:00 PM',
        location: 'Chennai, India',
        category: 'theater',
        price: 15,
        totalSeats: 200,
        availableSeats: 200,
        organizer: user._id,
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1000&h=400&fit=crop'
      },
      {
        title: 'Sports Championship Final',
        description: 'Watch the most exciting sports championship finals with live commentary and entertainment.',
        date: new Date('2026-06-01'),
        startTime: '06:00 PM',
        endTime: '10:00 PM',
        location: 'Hyderabad, India',
        category: 'sports',
        price: 60,
        totalSeats: 10000,
        availableSeats: 10000,
        organizer: user._id,
        image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1000&h=400&fit=crop'
      }
    ];

    // Create sample events
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`✓ Successfully added ${createdEvents.length} sample events to the database!`);
    
    console.log('\nEvents added:');
    createdEvents.forEach(event => {
      console.log(`  - ${event.title} (${event.price}$ - ${event.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
