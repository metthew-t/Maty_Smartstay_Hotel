// API utility for making authenticated requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Get token from localStorage
const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
};

// API request helper
export const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { message: response.statusText };
        }

        // Handle token expiration/invalid token specifically
        if (response.status === 401) {
            const message = errorData.detail || errorData.message || 'Session expired. Please log in again.';

            // Clear token if it's invalid
            if (typeof window !== 'undefined' && (message.toLowerCase().includes('token') || message.toLowerCase().includes('expired') || response.status === 401)) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                // Optional: Redirect to login
                // window.location.href = '/register';
            }

            const error = new Error(message);
            error.status = 401;
            throw error;
        }

        const error = new Error(errorData.detail || errorData.message || JSON.stringify(errorData));
        error.status = response.status;
        error.data = errorData;
        throw error;
    }

    return response.json();
};

// Auth APIs
export const authAPI = {
    login: (credentials) => apiRequest('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    register: (userData) => apiRequest('/auth/register/', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    getProfile: () => apiRequest('/auth/me/'),
};

// Analytics APIs
export const analyticsAPI = {
    getDashboard: () => apiRequest('/analytics/dashboard/'),
};

// Settings APIs
export const settingsAPI = {
    get: () => apiRequest('/settings/'),
    update: (data) => apiRequest('/settings/', {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
};

// User Management APIs
export const userAPI = {
    list: () => apiRequest('/auth/users/'),
    get: (id) => apiRequest(`/auth/users/${id}/`),
    update: (id, data) => apiRequest(`/auth/users/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    delete: (id) => apiRequest(`/auth/users/${id}/`, {
        method: 'DELETE',
    }),
};

// Chat APIs (StayMate AI)
export const chatAPI = {
    sendMessage: (message) => apiRequest('/chat/chat/', {
        method: 'POST',
        body: JSON.stringify({ message }),
    }),
    getHistory: () => apiRequest('/chat/history/'),
};

// Food Ordering APIs
export const foodAPI = {
    getMenu: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return apiRequest(`/services/menu/?${params}`);
    },
    createOrder: (orderData) => apiRequest('/services/food-order/', {
        method: 'POST',
        body: JSON.stringify(orderData),
    }),
    getMyOrders: () => apiRequest('/services/my-orders/'),
    // Staff methods
    staffGetOrders: () => apiRequest('/services/staff/orders/'),
    staffUpdateStatus: (id, status) => apiRequest(`/services/staff/orders/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    }),
    staffGetMenu: () => apiRequest('/services/staff/menu/'),
    staffCreateMenuItem: (data) => apiRequest('/services/staff/menu/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    staffUpdateMenuItem: (id, data) => apiRequest(`/services/staff/menu/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    staffDeleteMenuItem: (id) => apiRequest(`/services/staff/menu/${id}/`, {
        method: 'DELETE',
    }),
};

// Services APIs
export const serviceAPI = {
    list: () => apiRequest('/services/list/'),
    request: (data) => apiRequest('/services/request/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getMyRequests: () => apiRequest('/services/my-requests/'),
    // Staff methods
    staffGetRequests: () => apiRequest('/services/staff/requests/'),
    staffUpdateStatus: (id, status) => apiRequest(`/services/staff/requests/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    }),
};

// Payment APIs
export const paymentAPI = {
    create: (data) => apiRequest('/payments/create/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getMyPayments: () => apiRequest('/payments/my-payments/'),
    getInvoices: () => apiRequest('/payments/invoices/'),
    downloadInvoice: (invoiceId) => {
        const token = getToken();
        return fetch(`${API_BASE_URL}/payments/invoice/${invoiceId}/pdf/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    initializeChapa: (data) => apiRequest('/payments/initialize-chapa/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

// Booking APIs
export const bookingAPI = {
    getRooms: () => apiRequest('/hotel/rooms/'),
    getAvailableRooms: (checkIn, checkOut) => {
        const params = new URLSearchParams({ check_in: checkIn, check_out: checkOut });
        return apiRequest(`/hotel/rooms/available/?${params}`);
    },
    createBooking: (data) => apiRequest('/hotel/bookings/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getMyBookings: () => apiRequest('/hotel/bookings/'),
    // Staff methods
    staffMonitorRooms: () => apiRequest('/hotel/staff/rooms/'),
    updateRoom: (id, data) => apiRequest(`/hotel/rooms/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    uploadMedia: (formData) => {
        const token = getToken();
        return fetch(`${API_BASE_URL}/hotel/room-media/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        }).then(res => res.json());
    },
    deleteMedia: (id) => apiRequest(`/hotel/room-media/${id}/`, {
        method: 'DELETE',
    }),
    getCategories: () => apiRequest('/hotel/room-categories/'),
};
