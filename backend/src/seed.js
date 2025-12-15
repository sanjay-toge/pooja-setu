require('dotenv').config();
const mongoose = require('mongoose');
const Temple = require('./models/Temple');
const Pooja = require('./models/Pooja');
const God = require('./models/God');

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
        await God.deleteMany({});

        console.log('Cleared existing data');

        // --- GODS SEED DATA ---
        await God.create([
            {
                id: 'ganesha',
                name: 'Lord Ganesha',
                image: 'https://images.unsplash.com/photo-1566955047463-c7943534df89?q=80&w=800&auto=format&fit=crop',
                description: 'The Remover of Obstacles, Lord of Beginnings, and patron of arts and sciences.',
                teachings: [
                    'Wisdom lies in listening more (large ears) and talking less (small mouth).',
                    'Digest the good and bad in life with equanimity (large belly).',
                    'Focus on the task at hand with narrow concentration (small eyes).'
                ],
                purans: ['Ganesha Purana', 'Mudgala Purana'],
                mantras: [
                    { title: 'Bija Mantra', text: 'Om Gam Ganapataye Namaha', meaning: 'I bow to the Lord of Hosts/Groups.' },
                    { title: 'Vakratunda Mahakaya', text: 'Vakratunda Mahakaya Surya Koti Samaprabha...', meaning: 'O Lord with curved trunk and immense body...' }
                ],
                stories: [
                    { title: 'The Race Around the World', content: 'When asked to race around the world, Ganesha simply circled his parents, Shiva and Parvati, declaring them his world.' }
                ],
                topMandirs: [
                    { name: 'Siddhivinayak Temple', location: 'Mumbai, Maharashtra', description: 'One of the richest and most visited temples.' },
                    { name: 'Dagdusheth Halwai Ganpati', location: 'Pune, Maharashtra', description: 'Famous for its Golden Idol.' }
                ]
            },
            {
                id: 'shiva',
                name: 'Lord Shiva',
                image: 'https://images.unsplash.com/photo-1583096114844-065dc69bc133?q=80&w=800&auto=format&fit=crop',
                description: 'The Destroyer and the Transformer within the Trimurti, the Supreme Being in Shaivism.',
                teachings: [
                    'Detachment from material possessions leads to inner peace.',
                    ' Anger usually causes destruction; control it (Third Eye).',
                    'Stillness (Meditation) is the source of immense power.'
                ],
                purans: ['Shiva Purana', 'Linga Purana'],
                mantras: [
                    { title: 'Panchakshari Mantra', text: 'Om Namah Shivaya', meaning: 'I bow to Shiva.' },
                    { title: 'Mahamrityunjaya Mantra', text: 'Om Tryambakam Yajamahe...', meaning: 'We worship the Three-Eyed One...' }
                ],
                stories: [
                    { title: 'Churning of the Ocean', content: 'Shiva consumed the deadly poison Halahala to save the universe, turning his throat blue (Neelkanth).' }
                ],
                topMandirs: [
                    { name: 'Kashi Vishwanath', location: 'Varanasi, UP', description: 'One of the twelve Jyotirlingas.' },
                    { name: 'Kedarnath', location: 'Uttarakhand', description: 'Highest of the 12 Jyotirlingas.' }
                ]
            }
        ]);
        console.log('Gods seeded successfully');

        const temples = [
            {
                id: 't1',
                name: 'Dagdusheth Halwai Ganpati',
                city: 'Pune',
                description: 'One of Pune\'s most revered Ganpati temples, established in 1893. The idol is adorned with approximately 8 kg of gold and attracts millions of devotees during Ganesh Chaturthi.',
                heroImageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800',
                rating: 4.8,
                deities: ['Ganesha'],
                vipPricing: {
                    enabled: true,
                    priceINR: 399
                },
                openingTime: '05:00',  // 5 AM opening time
                closingTime: '22:30',  // 10:30 PM closing (11 PM on Tuesdays)
                liveDarshanUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                blogs: [
                    {
                        title: 'Ganesh Chaturthi Festival at Dagdusheth',
                        excerpt: 'Experience the grandeur of the 10-day festival where millions of devotees gather...',
                        content: 'The Ganesh Chaturthi festival at Dagdusheth Temple is a magnificent celebration that transforms the entire city of Pune. For 10 days, the temple becomes the epicenter of devotion, with elaborate decorations, continuous aarti, and cultural programs.',
                        author: 'Temple Trust',
                        imageUrl: 'https://images.unsplash.com/photo-1599843056002-0b1d9d44b16c?w=800'
                    },
                    {
                        title: 'History of the Golden Idol',
                        excerpt: 'Discover the fascinating story behind the 8 kg gold-adorned Ganesha idol...',
                        content: 'The main idol at Dagdusheth Temple is adorned with approximately 8 kilograms of gold. This tradition began in the early 20th century when devotees started offering gold ornaments as a mark of their devotion.',
                        author: 'Temple Historian',
                        imageUrl: 'https://images.unsplash.com/photo-1602216056172-f4c77aaa6f46?w=800'
                    }
                ],
                gallery: [
                    { url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800', caption: 'Main shrine during festival' },
                    { url: 'https://images.unsplash.com/photo-1599843056002-0b1d9d44b16c?w=800', caption: 'Evening aarti ceremony' },
                    { url: 'https://images.unsplash.com/photo-1602216056172-f4c77aaa6f46?w=800', caption: 'Decorated courtyard' },
                    { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', caption: 'Temple exterior at night' },
                    { url: 'https://images.unsplash.com/photo-1584267385494-9fdd9a71ad75?w=800', caption: 'Devotees during darshan' }
                ],
                teachings: [
                    {
                        title: 'Ganesh Mantra',
                        content: 'Om Gam Ganapataye Namaha - This powerful mantra removes obstacles and brings prosperity. Chant it 108 times daily for best results.',
                        category: 'mantra',
                        deity: 'Ganesha'
                    },
                    {
                        title: 'Why Ganesha is Worshipped First',
                        content: 'According to Hindu tradition, Lord Ganesha is worshipped before beginning any auspicious task. He is the remover of obstacles and the lord of beginnings. This practice ensures success in all endeavors.',
                        category: 'story',
                        deity: 'Ganesha'
                    },
                    {
                        title: 'Modak - The Divine Offering',
                        content: 'Modak is Lord Ganesha\'s favorite sweet. Offering 21 modaks represents the 21 qualities one must possess to attain spiritual perfection. Each modak symbolizes a virtue like patience, compassion, and devotion.',
                        category: 'philosophy',
                        deity: 'Ganesha'
                    }
                ]
            },
            {
                id: 't2',
                name: 'Mahalaxmi Temple',
                city: 'Mumbai',
                description: 'Ancient temple dedicated to Goddess Lakshmi, built around 1785. Located by the Arabian Sea, it houses the idols of Mahalakshmi, Mahakali, and Mahasaraswati.',
                heroImageUrl: 'https://images.unsplash.com/photo-1609347346972-c62fdf910b30?w=800',
                rating: 4.7,
                deities: ['Lakshmi', 'Kali', 'Saraswati'],
                vipPricing: {
                    enabled: true,
                    priceINR: 499
                },
                openingTime: '06:00',  // 6 AM opening time
                closingTime: '22:00',  // 10 PM closing time
                liveDarshanUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                blogs: [
                    {
                        title: 'The Legend of Mahalaxmi Temple',
                        excerpt: 'Built in 1785, discover the mystical story behind this ancient sea-facing temple...',
                        content: 'The Mahalaxmi Temple is one of the most famous temples in Mumbai, built around 1785. According to legend, the temple was built after the sea threw up the idol of the goddess during reconstruction of Hornby Vellard.',
                        author: 'Temple Trust',
                        imageUrl: 'https://images.unsplash.com/photo-1609347346972-c62fdf910b30?w=800'
                    }
                ],
                gallery: [
                    { url: 'https://images.unsplash.com/photo-1609347346972-c62fdf910b30?w=800', caption: 'Temple by the sea' },
                    { url: 'https://images.unsplash.com/photo-1605481963135-05e4b8ed3ebf?w=800', caption: 'Main sanctum' },
                    { url: 'https://images.unsplash.com/photo-1597040562399-3a2b8d8c1d31?w=800', caption: 'Evening aarti' }
                ],
                teachings: [
                    {
                        title: 'Lakshmi Mantra',
                        content: 'Om Shreem Mahalakshmiyei Namaha - Chant this mantra to invite prosperity and abundance into your life.',
                        category: 'mantra',
                        deity: 'Lakshmi'
                    },
                    {
                        title: 'Eight Forms of Lakshmi',
                        content: 'Goddess Lakshmi manifests in eight forms: Adi Lakshmi, Dhanya Lakshmi, Dhairya Lakshmi, Gaja Lakshmi, Santana Lakshmi, Vijaya Lakshmi, Vidya Lakshmi, and Dhana Lakshmi. Each form bestows a specific blessing.',
                        category: 'philosophy',
                        deity: 'Lakshmi'
                    }
                ]
            },
            {
                id: 't3',
                name: 'Siddhivinayak Temple',
                city: 'Mumbai',
                description: 'One of Mumbai\'s most visited temples, established in 1801. The idol of Lord Ganesha is believed to be Navsacha Ganpati (the one who fulfills all wishes).',
                heroImageUrl: 'https://images.unsplash.com/photo-1610519033184-87379cc41ffa?w=800',
                rating: 4.9,
                deities: ['Ganesha'],
                vipPricing: {
                    enabled: true,
                    priceINR: 50  // Paid darshan to skip queues
                },
                openingTime: '05:30',  // 5:30 AM (3:15 AM on Tuesdays)
                closingTime: '21:50',  // 9:50 PM normal days
                liveDarshanUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                blogs: [
                    {
                        title: 'Navsacha Ganpati - The Wish Fulfilling Ganesha',
                        excerpt: 'Why Siddhivinayak is called the one who grants wishes to all devotees...',
                        content: 'Siddhivinayak literally means "the Ganesha who grants all wishes". The temple was built in 1801 and has since been a beacon of hope for millions seeking divine blessings.',
                        author: 'Temple Administrator',
                        imageUrl: 'https://images.unsplash.com/photo-1610519033184-87379cc41ffa?w=800'
                    }
                ],
                gallery: [
                    { url: 'https://images.unsplash.com/photo-1610519033184-87379cc41ffa?w=800', caption: 'Inner sanctum' },
                    { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', caption: 'Temple dome' },
                    { url: 'https://images.unsplash.com/photo-1584267385494-9fdd9a71ad75?w=800', caption: 'Prayer hall' }
                ],
                teachings: [
                    {
                        title: 'Ganpati Atharvashirsha',
                        content: 'This ancient Vedic hymn dedicated to Lord Ganesha is one of the most powerful prayers. Reciting it brings wisdom, prosperity, and removes all obstacles.',
                        category: 'ritual',
                        deity: 'Ganesha'
                    }
                ]
            },
            {
                id: 't4',
                name: 'Kashi Vishwanath Temple',
                city: 'Varanasi',
                description: 'One of the holiest Shiva temples in India, located on the banks of the Ganges in Varanasi. This sacred Jyotirlinga attracts millions of devotees seeking blessings and spiritual liberation.',
                heroImageUrl: 'https://images.unsplash.com/photo-1582142306909-195724d33fe4?w=800',
                rating: 4.9,
                deities: ['Shiva'],
                vipPricing: {
                    enabled: true,
                    priceINR: 300  // Sugam Darshan price
                },
                openingTime: '03:00',  // Mangla Aarti starts at 3 AM
                closingTime: '23:00',  // Temple closes at 11 PM
                liveDarshanUrl: 'https://shrikashivishwanath.org/online/live_darshan',
                blogs: [
                    {
                        title: 'Kashi - The Eternal City of Shiva',
                        excerpt: 'Understand why Varanasi is considered the most sacred pilgrimage site...',
                        content: 'Kashi, also known as Varanasi or Banaras, is believed to be founded by Lord Shiva himself. The city represents the cosmic center of the universe in Hindu mythology. A visit to Kashi Vishwanath is said to grant moksha (liberation).',
                        author: 'Temple Scholars',
                        imageUrl: 'https://images.unsplash.com/photo-1582142306909-195724d33fe4?w=800'
                    },
                    {
                        title: 'The Jyotirlinga - Pillar of Light',
                        excerpt: 'Learn about the significance of the 12 Jyotirlingas and Kashi\'s special place...',
                        content: 'The Jyotirlinga at Kashi Vishwanath represents the infinite nature of Lord Shiva. It is one of the 12 sacred Jyotirlingas across India. The linga symbolizes the cosmic pillar of light.',
                        author: 'Temple Trust',
                        imageUrl: 'https://images.unsplash.com/photo-1600664356348-10686526af4f?w=800'
                    }
                ],
                gallery: [
                    { url: 'https://images.unsplash.com/photo-1582142306909-195724d33fe4?w=800', caption: 'Golden spires of the temple' },
                    { url: 'https://images.unsplash.com/photo-1600664356348-10686526af4f?w=800', caption: 'Ganga ghat view' },
                    { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', caption: 'Temple at dawn' },
                    { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', caption: 'Evening aarti' }
                ],
                teachings: [
                    {
                        title: 'Mahamrityunjaya Mantra',
                        content: 'Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat - This powerful mantra conquers death and disease, granting health and longevity.',
                        category: 'mantra',
                        deity: 'Shiva'
                    },
                    {
                        title: 'Significance of Ganga at Kashi',
                        content: 'The Holy Ganges at Varanasi is believed to wash away all sins. Taking a dip in the Ganga before visiting Kashi Vishwanath temple purifies the soul and prepares devotees for divine darshan.',
                        category: 'story',
                        deity: 'Shiva'
                    },
                    {
                        title: 'Rudra - The Fierce Form',
                        content: 'Lord Shiva at Kashi represents both creation and destruction. Understanding Rudra helps devotees comprehend the cyclical nature of existence and attain spiritual wisdom.',
                        category: 'philosophy',
                        deity: 'Shiva'
                    }
                ]
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
                participantCount: 4,
                imageUrl: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
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
                participantCount: 4,
                imageUrl: 'https://images.unsplash.com/photo-1574349487190-7cb52d83a152?w=800',
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
                id: 'p6',
                title: 'Ganpati Visarjan Pooja',
                description: 'Special pooja performed during Ganesh Chaturthi festival',
                templeId: 't1',
                durationMinutes: 90,
                basePriceINR: 550,
                participantCount: 10,
                imageUrl: 'https://images.unsplash.com/photo-1599843056002-0b1d9d44b16c?w=800',
                type: 'Special Puja',
                includedInTicket: [],
                specialNotes: [],
                termsAndConditions: [],
                addOns: []
            },
            {
                id: 'p3',
                title: 'Ganesh Chaturthi Special',
                templeId: 't3',
                basePriceINR: 1200,
                durationMinutes: 90,
                participantCount: 6,
                imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800',
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

        // Kashi Vishwanath Temple Poojas
        const kashiPoojas = [
            {
                id: 'p7',
                title: 'Sugam Darshan',
                description: 'Quick, queue-less, hassle-free darshan with priority entry.',
                templeId: 't4',
                durationMinutes: 30,
                basePriceINR: 300,
                participantCount: 1,
                imageUrl: 'https://images.unsplash.com/photo-1600664356348-10686526af4f?w=800',
                type: 'Darshan',
                includedInTicket: ['Priority entry', 'Skip the queue'],
                specialNotes: ['Not available during aarti times'],
                termsAndConditions: ['Booking confirmation required'],
                addOns: []
            },
            {
                id: 'p8',
                title: 'Mangla Aarti',
                description: 'First aarti of the day (3:00-4:00 AM). Divine awakening of Lord Shiva.',
                templeId: 't4',
                durationMinutes: 60,
                basePriceINR: 500,
                participantCount: 1,
                imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
                type: 'Aarti',
                includedInTicket: ['Aarti darshan', 'Prasad'],
                specialNotes: ['Arrive by 2:45 AM'],
                termsAndConditions: ['Advance booking required'],
                addOns: []
            },
            {
                id: 'p9',
                title: 'Rudrabhishek (1 Shastri)',
                description: 'Sacred abhishek with chanting of Sri Rudram by one priest.',
                templeId: 't4',
                durationMinutes: 45,
                basePriceINR: 450,
                participantCount: 6,
                imageUrl: 'https://images.unsplash.com/photo-1620317879483-33e506684813?w=800',
                type: 'Abhishek',
                includedInTicket: ['Rudrabhishek', 'Pandit dakshina'],
                specialNotes: ['Family of 6 members allowed'],
                termsAndConditions: ['One family per booking'],
                addOns: []
            },
            {
                id: 'p10',
                title: 'Rudrabhishek (5 Shastri)',
                description: 'Grand abhishek performed by five priests with synchronized Vedic chanting.',
                templeId: 't4',
                durationMinutes: 90,
                basePriceINR: 2100,
                participantCount: 8,
                imageUrl: 'https://images.unsplash.com/photo-1620317879483-33e506684813?w=800',
                type: 'Abhishek',
                includedInTicket: ['5 priests chanting', 'Complete abhishek materials'],
                specialNotes: ['Very auspicious'],
                termsAndConditions: ['Advance booking mandatory'],
                addOns: []
            },
            {
                id: 'p11',
                title: 'Saptarishi Aarti (Evening)',
                description: 'Grand evening aarti by seven priests (7:00-8:15 PM).',
                templeId: 't4',
                durationMinutes: 75,
                basePriceINR: 500,
                participantCount: 1,
                imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
                type: 'Aarti',
                includedInTicket: ['Aarti darshan', 'Prasad'],
                specialNotes: ['Most crowded aarti'],
                termsAndConditions: ['Entry before 6:45 PM'],
                addOns: []
            },
            {
                id: 'p12',
                title: 'Akhand Deep',
                description: 'Offering of eternal lamp for divine blessings. Burns continuously.',
                templeId: 't4',
                durationMinutes: 30,
                basePriceINR: 700,
                participantCount: 1,
                imageUrl: 'https://images.unsplash.com/photo-1476990521196-41fd44747c34?w=800',
                type: 'Puja',
                includedInTicket: ['Diya arrangement', 'Oil and wick'],
                specialNotes: ['Burns for 24 hours'],
                termsAndConditions: ['One-time booking'],
                addOns: []
            }
        ];

        await Pooja.deleteMany({});
        await Pooja.insertMany([...poojas, ...kashiPoojas]);
        console.log('Poojas seeded successfully');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
