import { create } from 'zustand';
import type { AuthState, User } from '../types';
import { authAPI } from '../services/api';

interface AuthStore extends AuthState {
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    token: localStorage.getItem('access_token'),
    isAuthenticated: !!localStorage.getItem('access_token'),
    isLoading: false,

    login: async (username: string, password: string) => {
        try {
            set({ isLoading: true });
            const response = await authAPI.login(username, password);

            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            const meResponse = await authAPI.getMe();
            const user: User = meResponse.data;

            set({
                user,
                token: access,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
        }

        try {
            set({ isLoading: true });
            const response = await authAPI.getMe();
            set({
                user: response.data,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            get().logout();
            set({ isLoading: false });
        }
    },

    setLoading: (loading: boolean) => {
        set({ isLoading: loading });
    },
}));