const API_BASE_URL = 'http://172.20.10.2:3000/api';
// const API_BASE_URL = 'https://pooja-setu-api-cvfec3etbpfegmau.canadacentral-01.azurewebsites.net/api';


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
    },

    // VIP Passes
    purchaseVipPass: async (data: any) => {
        const response = await fetch(`${API_BASE_URL}/vip-passes`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to purchase VIP pass');
        return response.json();
    },

    getMyVipPasses: async (status?: string) => {
        const url = status
            ? `${API_BASE_URL}/vip-passes?status=${status}`
            : `${API_BASE_URL}/vip-passes`;
        const response = await fetch(url, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch VIP passes');
        return response.json();
    },

    getVipPassById: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/vip-passes/${id}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch VIP pass');
        return response.json();
    },

    validateVipPass: async (qrCodeData: string) => {
        const response = await fetch(`${API_BASE_URL}/vip-passes/validate`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ qrCodeData })
        });
        if (!response.ok) throw new Error('Failed to validate VIP pass');
        return response.json();
    }
};
