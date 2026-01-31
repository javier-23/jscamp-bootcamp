import { create } from 'zustand';

// set y get son herramientas de Zustand para actualizar y obtener el estado
export const useFavoritesStore = create((set, get) => ({
    // Estado
    favorites: [],

    // Acciones
    clearFavorites: () => set({ favorites: [] }),

    addFavorite: (jobId) => {
        set((state) => ({
            favorites: state.favorites.includes(jobId)
            ? state.favorites 
            : [...state.favorites, jobId], 
        }));
    },

    removeFavorite: (jobId) => {
        set((state) => ({
            favorites: state.favorites.filter((id) => id !== jobId),
        }));
    },

    isFavorite: (jobId) => {
        return get().favorites.includes(jobId);
    },

    // Quitar o poner favorito según esté o no en favoritos
    toogleFavorite: (jobId) => {
        const { addFavorite, removeFavorite, isFavorite } = get();
        const isFav = isFavorite(jobId);
        isFav ? removeFavorite(jobId) : addFavorite(jobId);
    },

    countFavorites: () => {
        return get().favorites.length;
    }
}));