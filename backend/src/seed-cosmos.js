require('dotenv').config();
const mongoose = require('mongoose');
const Temple = require('./models/Temple');
const Pooja = require('./models/Pooja');

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await Temple.deleteMany({});
        await Pooja.deleteMany({});

        // Insert temples one by one to avoid throughput spike
        console.log('Inserting temples...');
        const temples = [
            {
                id: 't1',
                name: 'Dagdusheth Halwai Ganpati',
                city: 'Pune',
                description: 'Famous Ganesh temple in the heart of Pune city',
                heroImageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
                rating: 4.8,
                deities: ['Ganesha']
            },
            {
                id: 't2',
                name: 'Mahalaxmi Temple',
                city: 'Mumbai',
                description: 'Ancient temple dedicated to Goddess Lakshmi',
                heroImageUrl: 'https://images.unsplash.com/photo-1605481963135-05e4b8ed3ebf?w=800',
                rating: 4.7,
                deities: ['Lakshmi']
            },
            {
                id: 't3',
                name: 'Siddhivinayak Temple',
                city: 'Mumbai',
                description: 'One of the most visited temples in Mumbai',
                heroImageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
                rating: 4.9,
                deities: ['Ganesha']
            }
        ];

        // Insert one by one with delay
        for (const temple of temples) {
            await Temple.create(temple);
            console.log(`✓ Inserted temple: ${temple.name}`);
            await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
        }

        // Insert poojas one by one
        console.log('Inserting poojas...');
        const poojas = [
            {
                id: 'p1',
                title: 'Ganesh Abhishek',
                templeId: 't1',
                basePriceINR: 500,
                durationMinutes: 45,
                type: 'Abhishek',
                addOns: [
                    { id: 'a1', name: 'Modak Offering', priceINR: 100 },
                    { id: 'a2', name: 'Flower Garland', priceINR: 50 }
                ]
            },
            {
                id: 'p2',
                title: 'Lakshmi Puja',
                templeId: 't2',
                basePriceINR: 800,
                durationMinutes: 60,
                type: 'Puja',
                addOns: [
                    { id: 'a3', name: 'Gold Coin Offering', priceINR: 200 },
                    { id: 'a4', name: 'Special Bhog', priceINR: 150 }
                ]
            },
            {
                id: 'p3',
                title: 'Ganesh Chaturthi Special',
                templeId: 't3',
                basePriceINR: 1200,
                durationMinutes: 90,
                type: 'Special Puja',
                addOns: [
                    { id: 'a5', name: 'Complete Samagri', priceINR: 300 },
                    { id: 'a6', name: 'Live Recording', priceINR: 500 }
                ]
            }
        ];

        for (const pooja of poojas) {
            await Pooja.create(pooja);
            console.log(`✓ Inserted pooja: ${pooja.title}`);
            await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
        }

        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
