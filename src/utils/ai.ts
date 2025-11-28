import { dummy } from '../data/dummy'

type User = { name: string, phone?: string, email?: string, photo?: string, dob?: string, pob?: string }

export const getRecommendations = (user: User | null) => {
    if (!user) return []

    let recommendations: any[] = []
    const allPoojas = dummy.poojas

    // 1. Location-based Recommendation (POB)
    if (user.pob) {
        // Find temples in the user's city (simple substring match)
        const cityTemples = dummy.temples.filter(t => t.city.toLowerCase().includes(user.pob!.toLowerCase()))
        const cityPoojas = allPoojas.filter(p => cityTemples.some(t => t.id === p.templeId))

        if (cityPoojas.length > 0) {
            recommendations = [...recommendations, ...cityPoojas]
        }
    }

    // 2. Birthday Special (DOB) - Mock Logic
    // In a real app, we'd check if today is near the user's birthday.
    // For now, if DOB is present, we just recommend a "Ganesh Abhishek" for good luck.
    if (user.dob) {
        const birthdayPooja = allPoojas.find(p => p.title.includes('Ganesh'))
        if (birthdayPooja && !recommendations.some(r => r.id === birthdayPooja.id)) {
            recommendations.push(birthdayPooja)
        }
    }

    // 3. Fallback / General Trending
    // If we have very few recommendations, add some popular ones
    if (recommendations.length < 2) {
        const trending = allPoojas.slice(0, 3)
        recommendations = [...recommendations, ...trending]
    }

    // Remove duplicates
    const unique = Array.from(new Set(recommendations.map(a => a.id)))
        .map(id => recommendations.find(a => a.id === id))

    return unique.slice(0, 5) // Limit to 5
}
