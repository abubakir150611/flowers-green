"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesState = {
  ids: string[];
  toggle: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  remove: (productId: string) => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        set((state) =>
          state.ids.includes(productId)
            ? { ids: state.ids.filter((id) => id !== productId) }
            : { ids: [...state.ids, productId] }
        );
      },
      isFavorite: (productId) => get().ids.includes(productId),
      remove: (productId) => set((state) => ({ ids: state.ids.filter((id) => id !== productId) })),
    }),
    { name: "fg-favorites" }
  )
);
