// src/services/economics.ts
import { api } from './api';

export interface EconomicsFilters {
    period?: 'day' | 'week' | 'month' | 'year' | 'custom';
    date_from?: string;
    date_to?: string;
    limit?: number;
    waiter_id?: number;
}

export interface FinancialStats {
    total_revenue: number;
    average_order_value: number;
    order_count: number;
    revenue_growth: number;
    best_selling_hour: string;
    revenue_by_period: Array<{ period: string; revenue: number }>;
}

export interface ProductAnalytics {
    top_products: Array<{
        product_id: number;
        product_name: string;
        category: string;
        quantity_sold: number;
        total_revenue: number;
        order_count: number;
        percentage_of_total: number;
    }>;
    bottom_products: Array<{
        product_id: number;
        product_name: string;
        quantity_sold: number;
    }>;
}

export interface TemporalAnalytics {
    period: string;
    revenue: number;
    order_count: number;
    average_order_value: number;
}

export interface WaiterPerformance {
    waiter_id: number;
    waiter_name: string;
    total_orders: number;
    total_revenue: number;
    average_order_value: number;
    tables_served: number;
}

export const economicsAPI = {
    getFinancialStats: (filters: EconomicsFilters) =>
        api.get('/orders/economics/financial_stats/', { params: filters }),

    getProductAnalytics: (filters: EconomicsFilters) =>
        api.get('/orders/economics/product_analytics/', { params: filters }),

    getTemporalAnalytics: (filters: EconomicsFilters) =>
        api.get('/orders/economics/temporal_analytics/', { params: filters }),

    getWaiterPerformance: (filters: EconomicsFilters) =>
        api.get('/orders/economics/waiter_performance/', { params: filters }),
};