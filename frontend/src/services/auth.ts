import { api } from './api';

export const authService = {
    login: (username: string, password: string) =>
        api.post('/auth/token/', { username, password }),

    getMe: () => api.get('/auth/users/me/'),

    refreshToken: (refresh: string) =>
        api.post('/auth/token/refresh/', { refresh }),
};