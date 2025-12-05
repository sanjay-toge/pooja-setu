import dayjs from 'dayjs';

export type DailyHoroscope = {
    date: string;
    summary: string;
    health: {
        rating: number;
        description: string;
    };
    love: {
        rating: number;
        description: string;
    };
    work: {
        rating: number;
        description: string;
    };
    overall: {
        rating: number;
        description: string;
    };
};

// Descriptive text based on rating
const getDescription = (rating: number, category: string): string => {
    const descriptions = {
        health: {
            5: 'Excellent energy! Perfect day for physical activities',
            4: 'Good vitality. Take care of yourself',
            3: 'Moderate energy. Balance rest and activity',
            2: 'Low energy. Prioritize rest and wellness',
            1: 'Be extra cautious with your health today'
        },
        love: {
            5: 'Perfect harmony! Express your feelings openly',
            4: 'Good vibes in relationships. Quality time ahead',
            3: 'Balanced emotions. Communication is key',
            2: 'Minor tensions possible. Practice patience',
            1: 'Avoid conflicts. Give space where needed'
        },
        work: {
            5: 'Highly productive! Excellent day for new ventures',
            4: 'Good progress expected. Stay focused',
            3: 'Steady workflow. Handle routine tasks well',
            2: 'Some obstacles. Stay patient and persistent',
            1: 'Challenging day. Avoid major decisions'
        },
        overall: {
            5: 'Blessed day ahead! Everything aligns perfectly',
            4: 'Positive energy surrounds you today',
            3: 'Balanced day. Ups and downs in harmony',
            2: 'Stay grounded. Challenges are temporary',
            1: 'Practice patience. Better days are coming'
        }
    };

    return descriptions[category as keyof typeof descriptions][rating as keyof typeof descriptions.health];
};

// Generate consistent daily horoscope based on date
export const getDailyHoroscope = (): DailyHoroscope => {
    const today = dayjs().format('YYYY-MM-DD');

    // Use date as seed for consistent random numbers throughout the day
    const seed = parseInt(today.replace(/-/g, '')) % 100000;

    // Simple seeded random number generator
    const seededRandom = (index: number) => {
        const x = Math.sin(seed + index) * 10000;
        return x - Math.floor(x);
    };

    // Generate ratings (1-5) for each category
    const healthRating = Math.ceil(seededRandom(1) * 5);
    const loveRating = Math.ceil(seededRandom(2) * 5);
    const workRating = Math.ceil(seededRandom(3) * 5);

    // Overall is average of the three, rounded
    const overallRating = Math.round((healthRating + loveRating + workRating) / 3);

    // Generate summary based on overall rating
    const summaries = {
        5: 'The stars are perfectly aligned! Today brings excellent opportunities in all aspects of life. Your energy is high, relationships flourish, and work progresses smoothly. Embrace this blessed day with confidence and gratitude.',
        4: 'A positive and productive day ahead! While there may be minor challenges, your overall outlook is bright. Focus on your strengths and maintain good communication with loved ones. Success is within reach.',
        3: 'A balanced day with mixed energies. Stay flexible and adaptable as you navigate through ups and downs. Focus on what you can control and maintain patience. Small progress is still progress.',
        2: 'A day that calls for extra patience and self-care. While challenges may arise, they are temporary. Take time to rest, avoid major decisions, and lean on your support system. Better days are coming.',
        1: 'Today requires careful navigation and mindfulness. Prioritize self-care and avoid unnecessary risks. This is a time for reflection and patience rather than action. Remember, every challenge brings growth.'
    };

    const summary = summaries[overallRating as keyof typeof summaries];

    return {
        date: dayjs().format('dddd, DD MMMM YYYY'),
        summary,
        health: {
            rating: healthRating,
            description: getDescription(healthRating, 'health')
        },
        love: {
            rating: loveRating,
            description: getDescription(loveRating, 'love')
        },
        work: {
            rating: workRating,
            description: getDescription(workRating, 'work')
        },
        overall: {
            rating: overallRating,
            description: getDescription(overallRating, 'overall')
        }
    };
};
