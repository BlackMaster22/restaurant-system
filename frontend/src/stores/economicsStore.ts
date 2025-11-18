// src/stores/economicsStore.ts
import { create } from 'zustand';
import type {
    EconomicsFilters,
    FinancialStats,
    ProductAnalytics,
    TemporalAnalytics,
    WaiterPerformance
} from '../services/economics';
import { economicsAPI } from '../services/economics';

interface EconomicsStore {
    filters: EconomicsFilters;
    financialData: FinancialStats | null;
    productData: ProductAnalytics | null;
    temporalData: TemporalAnalytics[];
    waiterData: WaiterPerformance[];
    isLoading: boolean;
    error: string | null;

    setFilters: (filters: Partial<EconomicsFilters>) => void;
    fetchFinancialStats: () => Promise<void>;
    fetchProductAnalytics: () => Promise<void>;
    fetchTemporalAnalytics: () => Promise<void>;
    fetchWaiterPerformance: () => Promise<void>;
    fetchAllEconomicsData: () => Promise<void>;
    clearError: () => void;
}

export const useEconomicsStore = create<EconomicsStore>((set, get) => ({
    // Estado inicial
    filters: { period: 'month' },
    financialData: null,
    productData: null,
    temporalData: [],
    waiterData: [],
    isLoading: false,
    error: null,

    // Acciones
    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        }));
    },

    fetchFinancialStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const { filters } = get();
            const response = await economicsAPI.getFinancialStats(filters);
            set({ financialData: response.data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error fetching financial stats',
                isLoading: false
            });
        }
    },

    fetchProductAnalytics: async () => {
        set({ isLoading: true, error: null });
        try {
            const { filters } = get();
            const response = await economicsAPI.getProductAnalytics(filters);
            set({ productData: response.data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error fetching product analytics',
                isLoading: false
            });
        }
    },

    fetchTemporalAnalytics: async () => {
        set({ isLoading: true, error: null });
        try {
            const { filters } = get();
            const response = await economicsAPI.getTemporalAnalytics(filters);
            set({ temporalData: response.data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error fetching temporal analytics',
                isLoading: false
            });
        }
    },

    fetchWaiterPerformance: async () => {
        set({ isLoading: true, error: null });
        try {
            const { filters } = get();
            const response = await economicsAPI.getWaiterPerformance(filters);
            set({ waiterData: response.data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error fetching waiter performance',
                isLoading: false
            });
        }
    },

    fetchAllEconomicsData: async () => {
        set({ isLoading: true, error: null });
        try {
            const { filters } = get();
            const [financialStats, productAnalytics, temporalAnalytics, waiterPerformance] = await Promise.all([
                economicsAPI.getFinancialStats(filters),
                economicsAPI.getProductAnalytics(filters),
                economicsAPI.getTemporalAnalytics(filters),
                economicsAPI.getWaiterPerformance(filters),
            ]);

            set({
                financialData: financialStats.data,
                productData: productAnalytics.data,
                temporalData: temporalAnalytics.data,
                waiterData: waiterPerformance.data,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || 'Error fetching economics data',
                isLoading: false
            });
        }
    },

    clearError: () => set({ error: null }),
}));