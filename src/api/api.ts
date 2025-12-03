// const API_BASE_URL = 'http://192.168.1.6:3000/api';
const API_BASE_URL = 'https://pooja-setu-api-cvfec3etbpfegmau.canadacentral-01.azurewebsites.net/api';


let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

const getHeaders = () => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
};

export const api = {
    // Auth
    login: async (method: 'phone' | 'google' | 'facebook', data: any) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ method, ...data })
        });
        if (!response.ok) throw new Error('Login failed');
        const result = await response.json();
        setAuthToken(result.token);
        return result;
    },

    getMe: async () => {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to get user');
        return response.json();
    },

    updateProfile: async (data: any) => {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update profile');
        return response.json();
    },

    // Temples
    fetchTemples: async () => {
        const response = await fetch(`${API_BASE_URL}/temples`);
        if (!response.ok) throw new Error('Failed to fetch temples');
        return response.json();
    },

    // Poojas
    fetchPoojas: async () => {
        const response = await fetch(`${API_BASE_URL}/poojas`);
        if (!response.ok) throw new Error('Failed to fetch poojas');
        return response.json();
    },

    // Bookings
    createBooking: async (booking: any) => {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(booking)
        });
        if (!response.ok) throw new Error('Failed to create booking');
        return response.json();
    },

    getMyBookings: async () => {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch bookings');
        return response.json();
    },

    getBookingById: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch booking');
        return response.json();
    }
};
