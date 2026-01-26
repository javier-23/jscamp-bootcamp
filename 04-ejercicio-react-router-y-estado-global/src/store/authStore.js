import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    //Estado
    isLoggedIn: false,
    
    // Acciones
    handleLogin: () => set({ isLoggedIn: true }),
    handleLogOut: () => set({ isLoggedIn: false }),
}));