import { dummy } from '../data/dummy'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const api = {
    fetchPoojas: async () => {
        await delay(800)
        return dummy.poojas
    },

    fetchTemples: async () => {
        await delay(800)
        return dummy.temples
    },

    fetchPoojaById: async (id: string) => {
        await delay(500)
        return dummy.poojas.find(p => p.id === id)
    },

    fetchTempleById: async (id: string) => {
        await delay(500)
        return dummy.temples.find(t => t.id === id)
    },

    createBooking: async (bookingData: any) => {
        await delay(1500)
        const id = 'BKG' + Math.floor(Math.random() * 1e6).toString().padStart(6, '0')
        return { ...bookingData, id, status: 'confirmed' }
    }
}
