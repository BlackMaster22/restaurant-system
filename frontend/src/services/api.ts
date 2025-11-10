import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor para agregar token a las requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                const { access } = response.data;
                localStorage.setItem('access_token', access);

                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (username: string, password: string) =>
        api.post('/auth/token/', { username, password }),

    getMe: () => api.get('/auth/users/me/'),
};

export const menuAPI = {
    getCategories: () => api.get('/menu/categories/'),
    getCategory: (id: number) => api.get(`/menu/categories/${id}/`),
    createCategory: (data: any) => api.post('/menu/categories/', data),
    updateCategory: (id: number, data: any) => api.put(`/menu/categories/${id}/`, data),
    deleteCategory: (id: number) => api.delete(`/menu/categories/${id}/`),
    updateCategoryOrder: (data: any) => api.post('/menu/categories/update-order/', data),

    getMenuItems: () => api.get('/menu/items/'),
    getMenuItem: (id: number) => api.get(`/menu/items/${id}/`),

    // ACTUALIZADO para usar FormData
    createMenuItem: (data: FormData) =>
        api.post('/menu/items/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),

    updateMenuItem: (id: number, data: FormData) =>
        api.put(`/menu/items/${id}/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),

    deleteMenuItem: (id: number) => api.delete(`/menu/items/${id}/`),
};

export const ordersAPI = {
    getTables: () => api.get('/orders/tables/'),
    getTable: (id: number) => api.get(`/orders/tables/${id}/`),
    updateTable: (id: number, data: any) => api.put(`/orders/tables/${id}/`, data),

    getOrders: (status?: string) =>
        api.get('/orders/orders/', { params: { status } }),
    getOrder: (id: number) => api.get(`/orders/orders/${id}/`),
    createOrder: (data: any) => api.post('/orders/orders/', data),
    updateOrderStatus: (id: number, status: string) =>
        api.post(`/orders/orders/${id}/update_status/`, { status }),
};

export const usersAPI = {
    getUsers: () => api.get('/auth/users/'),
    getUser: (id: number) => api.get(`/auth/users/${id}/`),
    createUser: (data: any) => api.post('/auth/users/', data),
    updateUser: (id: number, data: any) => api.put(`/auth/users/${id}/`, data),
    deleteUser: (id: number) => api.delete(`/auth/users/${id}/`),

    getWaiters: () => api.get('/auth/users/waiters/'),
    getCashiers: () => api.get('/auth/users/cashiers/'),
};