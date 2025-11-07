import { create } from 'zustand';
import { Category, MenuItem } from '../types';
import { menuAPI } from '../services/api';

interface MenuStore {
    categories: Category[];
    menuItems: MenuItem[];
    selectedCategory: Category | null;
    loading: boolean;
    loadCategories: () => Promise<void>;
    loadMenuItems: () => Promise<void>;
    setSelectedCategory: (category: Category) => void;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
    categories: [],
    menuItems: [],
    selectedCategory: null,
    loading: false,

    loadCategories: async () => {
        set({ loading: true });
        try {
            const response = await menuAPI.getCategories();
            set({ categories: response.data });
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            set({ loading: false });
        }
    },

    loadMenuItems: async () => {
        set({ loading: true });
        try {
            const response = await menuAPI.getMenuItems();
            set({ menuItems: response.data });
        } catch (error) {
            console.error('Error loading menu items:', error);
        } finally {
            set({ loading: false });
        }
    },

    setSelectedCategory: (category: Category) => {
        set({ selectedCategory: category });
    },
}));