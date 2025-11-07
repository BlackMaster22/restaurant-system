import { create } from 'zustand';

interface UIStore {
    // Modales
    isLoginModalOpen: boolean;
    isCartModalOpen: boolean;
    isProductModalOpen: boolean;

    // Loading states
    globalLoading: boolean;

    // Actions
    openLoginModal: () => void;
    closeLoginModal: () => void;
    openCartModal: () => void;
    closeCartModal: () => void;
    openProductModal: () => void;
    closeProductModal: () => void;
    setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
    isLoginModalOpen: false,
    isCartModalOpen: false,
    isProductModalOpen: false,
    globalLoading: false,

    openLoginModal: () => set({ isLoginModalOpen: true }),
    closeLoginModal: () => set({ isLoginModalOpen: false }),
    openCartModal: () => set({ isCartModalOpen: true }),
    closeCartModal: () => set({ isCartModalOpen: false }),
    openProductModal: () => set({ isProductModalOpen: true }),
    closeProductModal: () => set({ isProductModalOpen: false }),
    setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));