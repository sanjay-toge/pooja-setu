import { create } from 'zustand'
import dayjs from 'dayjs'
import { api, setAuthToken } from './api/api'

type Booking = {
  id: string
  poojaId: string
  templeId: string
  date: string
  slotId: string
  inputs: { gotra?: string, nakshatra?: string, intentions?: string }
  addOnIds: string[]
  amountINR: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

type User = {
  name: string,
  phone?: string,
  email?: string,
  photo?: string,
  dob?: string,
  pob?: string,
  gender?: string,
  gotra?: string,
  rashi?: string,
  nakshatra?: string,
  isProfileComplete?: boolean
}

type State = {
  filters: { query?: string, city?: string, deity?: string, type?: string, date?: string, language?: string, maxPrice?: number }
  bookings: Booking[]
  poojas: any[]
  temples: any[]
  gods: any[]
  isLoading: boolean

  setFilter: (k: keyof State['filters'], v: string | number | undefined) => void
  clearFilters: () => void

  fetchData: () => Promise<void>
  fetchBookings: () => Promise<void>
  createBooking: (b: Omit<Booking, 'id' | 'status'>) => Promise<string>
  confirmBooking: (id: string) => void

  getPoojaById: (id: string) => any
  getTempleById: (id: string) => any
  getGodById: (id: string) => any

  // Auth
  user: User | null
  isAuthenticated: boolean
  login: (method: 'google' | 'facebook' | 'phone', data?: any) => Promise<void>
  googleLogin: (idToken: string) => Promise<any>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  completeProfile: (data: any) => Promise<void>

  // Theme
  themeMode: 'light' | 'dark'
  toggleTheme: () => void
}

export const useStore = create<State>((set, get) => ({
  filters: { date: dayjs().format('YYYY-MM-DD'), maxPrice: 2000 },
  bookings: [],
  poojas: [],
  temples: [],
  gods: [],
  isLoading: false,
  user: null,
  isAuthenticated: false,

  setFilter: (k, v) => set(s => ({ filters: { ...s.filters, [k]: v } })),
  clearFilters: () => set({ filters: {} as any }),

  fetchData: async () => {
    set({ isLoading: true })
    const [poojas, temples, gods] = await Promise.all([api.fetchPoojas(), api.fetchTemples(), api.fetchGods()])
    set({ poojas, temples, gods, isLoading: false })
  },

  fetchBookings: async () => {
    try {
      const bookings = await api.getMyBookings();
      set({ bookings });
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      set({ bookings: [] });
    }
  },

  createBooking: async (b) => {
    const newBooking = await api.createBooking(b)
    set(s => ({ bookings: [...s.bookings, newBooking] }))
    return newBooking.id
  },

  confirmBooking: (id) => set(s => ({ bookings: s.bookings.map(x => x.id === id ? { ...x, status: 'confirmed' } : x) })),

  getPoojaById: (id) => get().poojas.find(p => p.id === id),
  getTempleById: (id) => get().temples.find(t => t.id === id),
  getGodById: (id) => get().gods.find(g => g.id === id),

  login: async (method, data) => {
    const result = await api.login(method, data || {});
    set({ user: result.user, isAuthenticated: true });
  },

  googleLogin: async (idToken: string) => {
    const result = await api.googleLogin(idToken);
    set({ user: result.user, isAuthenticated: true });
    return result.user;
  },

  logout: async () => {
    await setAuthToken(null);
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (data) => set(s => ({ user: s.user ? { ...s.user, ...data } : null })),

  completeProfile: async (data: any) => {
    const result = await api.updateProfile(data);
    set(s => ({
      user: { ...s.user, ...result, isProfileComplete: true }
    }));
  },

  // Theme
  themeMode: 'dark',
  toggleTheme: () => set(s => ({ themeMode: s.themeMode === 'light' ? 'dark' : 'light' }))
}))
