import { create } from 'zustand';
import type { Order, CartItem, Table } from '../types';

interface OrderStore {
    cart: CartItem[];
    currentTable: Table | null;
    orders: Order[];
    activeOrders: Order[];

    addToCart: (item: CartItem) => void;
    removeFromCart: (index: number) => void;
    updateCartItem: (index: number, updates: Partial<CartItem>) => void;
    clearCart: () => void;
    setCurrentTable: (table: Table) => void;

    setOrders: (orders: Order[]) => void;
    addOrder: (order: Order) => void;
    updateOrder: (order: Order) => void;
    setActiveOrders: (orders: Order[]) => void;

    getCartTotal: () => number;
    getCartItemCount: () => number;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
    cart: [],
    currentTable: null,
    orders: [],
    activeOrders: [],

    addToCart: (item: CartItem) => {
        set((state) => ({
            cart: [...state.cart, item],
        }));
    },

    removeFromCart: (index: number) => {
        set((state) => ({
            cart: state.cart.filter((_, i) => i !== index),
        }));
    },

    updateCartItem: (index: number, updates: Partial<CartItem>) => {
        set((state) => ({
            cart: state.cart.map((item, i) =>
                i === index ? { ...item, ...updates } : item
            ),
        }));
    },

    clearCart: () => {
        set({ cart: [] });
    },

    setCurrentTable: (table: Table) => {
        set({ currentTable: table });
    },

    setOrders: (orders: Order[]) => {
        set({ orders });
    },

    addOrder: (order: Order) => {
        set((state) => ({
            orders: [order, ...state.orders],
            activeOrders: [order, ...state.activeOrders],
        }));
    },

    updateOrder: (order: Order) => {
        set((state) => ({
            orders: state.orders.map((o) => (o.id === order.id ? order : o)),
            activeOrders: state.activeOrders.map((o) => (o.id === order.id ? order : o)),
        }));
    },

    setActiveOrders: (orders: Order[]) => {
        set({ activeOrders: orders });
    },

    getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.totalPrice, 0);
    },

    getCartItemCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
    },
}));