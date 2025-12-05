import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';

dayjs.extend(dayOfYear);

export type ZodiacSign =
    | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
    | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
    | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type HoroscopeData = {
    sign: ZodiacSign;
    date: string;
    prediction: string;
    luckyNumber: number;
    luckyColor: string;
    rating: number; // 1-5 stars
    advice: string;
};

// Zodiac date ranges
const zodiacRanges: { sign: ZodiacSign; startMonth: number; startDay: number; endMonth: number; endDay: number }[] = [
    { sign: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { sign: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { sign: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
    { sign: 'Cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
    { sign: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { sign: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { sign: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    { sign: 'Scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    { sign: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
    { sign: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    { sign: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { sign: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 }
];

// Daily predictions pool (rotational)
const predictions: Record<ZodiacSign, string[]> = {
    Aries: [
        "Today brings new opportunities for leadership. Trust your instincts.",
        "Your energy is high. Channel it into productive activities.",
        "A spiritual practice will bring you peace today."
    ],
    Taurus: [
        "Financial stability is on the horizon. Stay patient.",
        "Focus on home and family matters today.",
        "Your hard work will soon pay off in unexpected ways."
    ],
    Gemini: [
        "Communication flows easily today. Share your ideas.",
        "A new friendship or connection is likely.",
        "Your curiosity leads you to interesting discoveries."
    ],
    Cancer: [
        "Emotional clarity comes through meditation or prayer.",
        "Family bonds strengthen today. Spend quality time together.",
        "Trust your intuition in important decisions."
    ],
    Leo: [
        "Your charisma attracts positive attention today.",
        "Creative projects flourish. Express yourself freely.",
        "Generosity brings unexpected rewards."
    ],
    Virgo: [
        "Attention to detail serves you well in all matters.",
        "Health and wellness should be prioritized today.",
        "Organization brings peace of mind."
    ],
    Libra: [
        "Balance and harmony are within reach today.",
        "Relationships benefit from honest communication.",
        "Beauty and art inspire your spiritual growth."
    ],
    Scorpio: [
        "Deep transformation is possible through spiritual practice.",
        "Trust in the process of change and renewal.",
        "Your intensity attracts meaningful connections."
    ],
    Sagittarius: [
        "Adventure and learning expand your horizons.",
        "Optimism attracts positive opportunities.",
        "Sharing wisdom brings blessings to others."
    ],
    Capricorn: [
        "Discipline and dedication lead to success.",
        "Long-term goals come into clearer focus.",
        "Respect for tradition brings spiritual rewards."
    ],
    Aquarius: [
        "Innovation and unique ideas set you apart.",
        "Community involvement brings fulfillment.",
        "Your humanitarian nature attracts good karma."
    ],
    Pisces: [
        "Compassion and intuition guide you wisely.",
        "Creative expression connects you to the divine.",
        "Dreams and meditation reveal important insights."
    ]
};

const advice = {
    Aries: "Visit a temple dedicated to Mars (Mangal). Wear red for confidence.",
    Taurus: "Offer flowers to Goddess Lakshmi. Green brings prosperity.",
    Gemini: "Light a lamp for Lord Ganesha. Yellow enhances communication.",
    Cancer: "Worship the Moon (Chandra). White brings peace and clarity.",
    Leo: "Honor the Sun (Surya). Gold attracts success and recognition.",
    Virgo: "Pray to Lord Vishnu. Green promotes health and balance.",
    Libra: "Seek blessings from Goddess Lakshmi. Pink enhances relationships.",
    Scorpio: "Worship Lord Hanuman for strength. Maroon brings transformation.",
    Sagittarius: "Pray to Lord Vishnu. Yellow attracts wisdom and growth.",
    Capricorn: "Honor Lord Shani (Saturn). Blue brings discipline and success.",
    Aquarius: "Seek blessings from Lord Shani. Electric blue inspires innovation.",
    Pisces: "Worship Lord Shiva. Sea green connects you to spirituality."
};

/**
 * Get zodiac sign from date of birth
 */
export function getZodiacSign(dob: string | Date): ZodiacSign {
    const date = dayjs(dob);
    const month = date.month() + 1; // dayjs months are 0-indexed
    const day = date.date();

    for (const range of zodiacRanges) {
        if (
            (month === range.startMonth && day >= range.startDay) ||
            (month === range.endMonth && day <= range.endDay) ||
            (range.startMonth > range.endMonth &&
                ((month === range.startMonth && day >= range.startDay) ||
                    (month === range.endMonth && day <= range.endDay)))
        ) {
            return range.sign;
        }
    }

    return 'Aries'; // Default fallback
}

/**
 * Get today's horoscope for a zodiac sign
 */
export function getTodayHoroscope(sign: ZodiacSign): HoroscopeData {
    const today = dayjs();
    const dayOfYear = today.dayOfYear();

    // Rotate through predictions based on day of year
    const predictionIndex = dayOfYear % predictions[sign].length;

    return {
        sign,
        date: today.format('DD MMMM YYYY'),
        prediction: predictions[sign][predictionIndex],
        luckyNumber: (dayOfYear % 9) + 1,
        luckyColor: getLuckyColor(sign, dayOfYear),
        rating: Math.floor((dayOfYear % 5)) + 1,
        advice: advice[sign]
    };
}

/**
 * Get horoscope by date of birth
 */
export function getHoroscopeByDOB(dob: string | Date): HoroscopeData | null {
    if (!dob) return null;

    const sign = getZodiacSign(dob);
    return getTodayHoroscope(sign);
}

/**
 * Get lucky color for the day
 */
function getLuckyColor(sign: ZodiacSign, dayOfYear: number): string {
    const colors: Record<ZodiacSign, string[]> = {
        Aries: ['Red', 'Orange', 'Scarlet'],
        Taurus: ['Green', 'Pink', 'Emerald'],
        Gemini: ['Yellow', 'Light Blue', 'White'],
        Cancer: ['White', 'Silver', 'Cream'],
        Leo: ['Gold', 'Orange', 'Yellow'],
        Virgo: ['Green', 'Brown', 'Beige'],
        Libra: ['Pink', 'Light Blue', 'Lavender'],
        Scorpio: ['Maroon', 'Red', 'Black'],
        Sagittarius: ['Purple', 'Blue', 'Yellow'],
        Capricorn: ['Brown', 'Grey', 'Black'],
        Aquarius: ['Electric Blue', 'Turquoise', 'Silver'],
        Pisces: ['Sea Green', 'Lavender', 'Purple']
    };

    const signColors = colors[sign];
    return signColors[dayOfYear % signColors.length];
}
