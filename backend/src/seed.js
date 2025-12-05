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
        await Temple.deleteMany({});
        await Pooja.deleteMany({});

        // Insert temples
        const temples = [
            {
                id: 't1',
                name: 'Dagdusheth Halwai Ganpati',
                city: 'Pune',
                description: 'Famous Ganesh temple in the heart of Pune city',
                heroImageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
                rating: 4.8,
                deities: ['Ganesha'],
                vipPricing: {
                    enabled: true,
                    morningSlot: { priceINR: 499, timeRange: '6:00 AM - 9:00 AM' },
                    afternoonSlot: { priceINR: 399, timeRange: '12:00 PM - 3:00 PM' },
                    eveningSlot: { priceINR: 599, timeRange: '5:00 PM - 8:00 PM' }
                }
            },
            {
                id: 't2',
                name: 'Mahalaxmi Temple',
                city: 'Mumbai',
                description: 'Ancient temple dedicated to Goddess Lakshmi',
                heroImageUrl: 'https://images.unsplash.com/photo-1605481963135-05e4b8ed3ebf?w=800',
                rating: 4.7,
                deities: ['Lakshmi'],
                vipPricing: {
                    enabled: true,
                    morningSlot: { priceINR: 599, timeRange: '6:00 AM - 9:00 AM' },
                    afternoonSlot: { priceINR: 499, timeRange: '12:00 PM - 3:00 PM' },
                    eveningSlot: { priceINR: 699, timeRange: '5:00 PM - 8:00 PM' }
                }
            },
            {
                id: 't3',
                name: 'Siddhivinayak Temple',
                city: 'Mumbai',
                description: 'One of the most visited temples in Mumbai',
                heroImageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
                rating: 4.9,
                deities: ['Ganesha'],
                vipPricing: {
                    enabled: true,
                    morningSlot: { priceINR: 799, timeRange: '6:00 AM - 9:00 AM' },
                    afternoonSlot: { priceINR: 649, timeRange: '12:00 PM - 3:00 PM' },
                    eveningSlot: { priceINR: 899, timeRange: '5:00 PM - 8:00 PM' }
                }
            }
        ];

        await Temple.insertMany(temples);
        console.log('Temples seeded successfully');

        // Insert poojas
        const poojas = [
            {
                id: 'p1',
                title: 'Ganesh Abhishek',
                templeId: 't1',
                basePriceINR: 500,
                durationMinutes: 45,
                type: 'Abhishek',
                description: 'Lord Ganesha, the remover of obstacles and the god of wisdom and prosperity, is worshipped through this sacred Abhishek ritual. The essence of this puja involves the holy chanting of Ganesh mantras and giving a ceremonial bath to the deity with sacred materials including milk, honey, ghee, curd, and sugar (Panchamrit). This is one of the most powerful forms of worship in Hinduism and is believed to bless devotees with success, prosperity, and the removal of obstacles from all endeavors.',
                includedInTicket: [
                    'Temple entry fee',
                    'Pandit/Shastri dakshina',
                    'Pooja Thali with all required items',
                    'Panchamrit materials (milk, honey, ghee, curd, sugar)',
                    'Basic flowers and incense'
                ],
                specialNotes: [
                    'Devotees can purchase additional Modak offerings as per their requirement',
                    'Special flower garlands are available at the temple premises',
                    'Please arrive 15 minutes before your scheduled time slot',
                    'Traditional attire is recommended but not mandatory'
                ],
                termsAndConditions: [
                    'Please carry a hard copy or digital copy of this ticket at the time of Pooja',
                    'Please visit the temple helpdesk to be assigned a Pandit for your Pooja',
                    'One ticket is valid for one family only (Husband, wife & children below 12 years)',
                    'Abhishek timings are from 6:00 AM to 8:00 PM',
                    'This ticket excludes photography charges, if applicable',
                    'Pooja date cannot be rescheduled once booked',
                    'Devotees must follow temple dress code and guidelines',
                    'Mobile phones should be kept on silent mode during the puja'
                ],
                addOns: [
                    { id: 'a1', name: 'Modak Offering (1kg)', priceINR: 100 },
                    { id: 'a2', name: 'Premium Flower Garland', priceINR: 50 }
                ]
            },
            {
                id: 'p2',
                title: 'Lakshmi Puja',
                templeId: 't2',
                basePriceINR: 800,
                durationMinutes: 60,
                type: 'Puja',
                description: 'Goddess Lakshmi, the deity of wealth, fortune, and prosperity, is worshipped through this auspicious ritual. This comprehensive puja involves the chanting of Lakshmi Ashtottara and Sri Suktam, along with offerings of lotus flowers, gold ornaments, and special bhog. The ritual is believed to bring abundance, financial stability, and overall prosperity to the devotee\'s life. Regular worship of Goddess Lakshmi removes poverty and brings happiness and peace to the household.',
                includedInTicket: [
                    'Temple darshan priority access',
                    'Qualified Pandit for conducting the puja',
                    'Complete Pooja Samagri (materials)',
                    'Lotus flowers and tulsi leaves',
                    'Prasad distribution',
                    'Kumkum and turmeric'
                ],
                specialNotes: [
                    'Gold coins for offering can be purchased at the temple shop',
                    'Special bhog prasad is available as an optional add-on',
                    'Photography is allowed but video recording requires special permission',
                    'Devotees should bring their own aarti thali if they have one (optional)',
                    'The puja is conducted in Sanskrit with Hindi explanations'
                ],
                termsAndConditions: [
                    'Valid photo ID must be presented at the temple entrance',
                    'Booking confirmation (SMS/Email) must be shown at the counter',
                    'One ticket covers up to 4 family members',
                    'Puja timings are strictly followed - late arrivals may not be accommodated',
                    'Children below 5 years are allowed free entry',
                    'No refunds will be provided for cancellations',
                    'Temple reserves the right to reschedule in case of special occasions',
                    'Prasad must be collected on the same day'
                ],
                addOns: [
                    { id: 'a3', name: 'Gold Coin Offering (5g)', priceINR: 200 },
                    { id: 'a4', name: 'Special Bhog Prasad', priceINR: 150 }
                ]
            },
            {
                id: 'p3',
                title: 'Ganesh Chaturthi Special',
                templeId: 't3',
                basePriceINR: 1200,
                durationMinutes: 90,
                type: 'Special Puja',
                description: 'A grand and elaborate worship ceremony dedicated to Lord Ganesha, performed during the auspicious Ganesh Chaturthi festival. This special puja includes the Shodashopachara (16-step worship), chanting of Ganapati Atharvashirsha, and elaborate rituals with 21 different types of offerings. The puja is conducted by senior priests and includes live music, bhajans, and aarti. This powerful ritual is believed to bestow immense blessings, remove all obstacles, and bring success in all ventures. Perfect for new beginnings, business launches, or seeking divine intervention.',
                includedInTicket: [
                    'VIP darshan access with priority entry',
                    'Senior Pandit team for conducting the elaborate ritual',
                    'Complete Shodashopachara Samagri',
                    'All 21 types of offerings and materials',
                    'Special Modak prasad (1kg)',
                    'Live bhajan and kirtan by professional artists',
                    'Commemorative certificate of puja completion',
                    'Digital photo documentation'
                ],
                specialNotes: [
                    'This is a premium puja package with extended duration',
                    'Complete samagri for elaborate rituals is included in the base price',
                    'Live video recording service is available as an add-on',
                    'Devotees will receive a personalized blessing from the head priest',
                    'Special seating arrangement will be provided for the family',
                    'The puja will be conducted in Sanskrit with detailed explanations in Hindi/English',
                    'Reservation required - limited slots available per day'
                ],
                termsAndConditions: [
                    'Advance booking is mandatory - minimum 3 days prior notice required',
                    'Valid government ID proof must be presented for all adult members',
                    'Digital or printed booking confirmation must be shown',
                    'One ticket is valid for immediate family (up to 6 members)',
                    'Puja will be conducted at the scheduled time - no delays accepted',
                    'Special festival timings: 5:00 AM to 10:00 PM',
                    'No refund or rescheduling allowed within 24 hours of booking',
                    'Temple photography policy must be strictly followed',
                    'Devotees must reach 30 minutes before the scheduled time',
                    'Outside food and beverages are not allowed in the temple premises'
                ],
                addOns: [
                    { id: 'a5', name: 'Complete Premium Samagri Kit', priceINR: 300 },
                    { id: 'a6', name: 'Live Video Recording & USB', priceINR: 500 }
                ]
            }
        ];

        await Pooja.insertMany(poojas);
        console.log('Poojas seeded successfully');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
