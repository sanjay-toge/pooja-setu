import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';

dayjs.extend(dayOfYear);

export type PanchangData = {
    date: string;
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    sunrise: string;
    sunset: string;
    rahukaal: string;
    gulikaKaal: string;
    moonSign: string;
};

// Tithi names (1-30)
const tithiNames = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
];

// Nakshatra names (1-27)
const nakshatraNames = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
    'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
    'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
    'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

// Yoga names (1-27)
const yogaNames = [
    'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti'
];

// Karana names
const karanaNames = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja',
    'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'
];

// Calculate Tithi based on moon phase (simplified)
function calculateTithi(date: dayjs.Dayjs): string {
    // Simplified: Using day of month as approximation
    // In production, use actual lunar calendar calculation or API
    const dayOfMonth = date.date();
    const tithiIndex = (dayOfMonth % 30);
    return tithiNames[tithiIndex];
}

// Calculate Nakshatra (simplified)
function calculateNakshatra(date: dayjs.Dayjs): string {
    const dayOfYear = date.dayOfYear();
    const nakshatraIndex = (dayOfYear % 27);
    return nakshatraNames[nakshatraIndex];
}

// Calculate Yoga (simplified)
function calculateYoga(date: dayjs.Dayjs): string {
    const dayOfYear = date.dayOfYear();
    const yogaIndex = ((dayOfYear + 7) % 27);
    return yogaNames[yogaIndex];
}

// Calculate Karana (simplified)
function calculateKarana(date: dayjs.Dayjs): string {
    const dayOfMonth = date.date();
    const karanaIndex = (dayOfMonth % 11);
    return karanaNames[karanaIndex];
}

// Calculate sunrise (approximate based on location)
function calculateSunrise(date: dayjs.Dayjs): string {
    // Simplified: Assuming India timezone, average sunrise around 6 AM
    const month = date.month();
    let hour = 6;
    let minute = 0;

    // Adjust for seasons
    if (month >= 10 || month <= 1) { // Winter
        hour = 6;
        minute = 30;
    } else if (month >= 4 && month <= 7) { // Summer  
        hour = 5;
        minute = 30;
    }

    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} AM`;
}

// Calculate sunset (approximate)
function calculateSunset(date: dayjs.Dayjs): string {
    const month = date.month();
    let hour = 6;
    let minute = 0;

    // Adjust for seasons
    if (month >= 10 || month <= 1) { // Winter
        hour = 5;
        minute = 45;
    } else if (month >= 4 && month <= 7) { // Summer
        hour = 7;
        minute = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} PM`;
}

// Calculate Rahukaal (inauspicious time)
function calculateRahukaal(date: dayjs.Dayjs): string {
    const dayOfWeek = date.day(); // 0 = Sunday
    const rahukaals = [
        '4:30 PM - 6:00 PM', // Sunday
        '7:30 AM - 9:00 AM', // Monday
        '3:00 PM - 4:30 PM', // Tuesday
        '12:00 PM - 1:30 PM', // Wednesday
        '1:30 PM - 3:00 PM', // Thursday
        '10:30 AM - 12:00 PM', // Friday
        '9:00 AM - 10:30 AM'  // Saturday
    ];
    return rahukaals[dayOfWeek];
}

// Calculate Gulika Kaal
function calculateGulikaKaal(date: dayjs.Dayjs): string {
    const dayOfWeek = date.day();
    const gulikaKaals = [
        '3:00 PM - 4:30 PM', // Sunday
        '12:00 PM - 1:30 PM', // Monday
        '1:30 PM - 3:00 PM', // Tuesday
        '10:30 AM - 12:00 PM', // Wednesday
        '9:00 AM - 10:30 AM', // Thursday
        '7:30 AM - 9:00 AM', // Friday
        '6:00 AM - 7:30 AM'  // Saturday
    ];
    return gulikaKaals[dayOfWeek];
}

// Calculate moon sign (simplified)
function calculateMoonSign(date: dayjs.Dayjs): string {
    const signs = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    const dayOfYear = date.dayOfYear();
    const signIndex = Math.floor((dayOfYear / 30.4) % 12);
    return signs[signIndex];
}

/**
 * Get today's Panchang data
 */
export function getTodayPanchang(): PanchangData {
    const today = dayjs();

    return {
        date: today.format('DD MMMM YYYY'),
        tithi: calculateTithi(today),
        nakshatra: calculateNakshatra(today),
        yoga: calculateYoga(today),
        karana: calculateKarana(today),
        sunrise: calculateSunrise(today),
        sunset: calculateSunset(today),
        rahukaal: calculateRahukaal(today),
        gulikaKaal: calculateGulikaKaal(today),
        moonSign: calculateMoonSign(today)
    };
}

/**
 * Get Panchang for a specific date
 */
export function getPanchangForDate(date: Date | string): PanchangData {
    const targetDate = dayjs(date);

    return {
        date: targetDate.format('DD MMMM YYYY'),
        tithi: calculateTithi(targetDate),
        nakshatra: calculateNakshatra(targetDate),
        yoga: calculateYoga(targetDate),
        karana: calculateKarana(targetDate),
        sunrise: calculateSunrise(targetDate),
        sunset: calculateSunset(targetDate),
        rahukaal: calculateRahukaal(targetDate),
        gulikaKaal: calculateGulikaKaal(targetDate),
        moonSign: calculateMoonSign(targetDate)
    };
}
