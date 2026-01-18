// store/usePickerStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePickerStore = create(
  persist(
    (set) => ({
      /* =====================================================
         USER / NAME DATA
      ===================================================== */
      items: [],
      selectedIds: new Set(),

      addMany: (values) =>
        set((state) => {
          const existingValues = new Set(
            state.items.map((i) => i.value.toLowerCase())
          );

          const normalized = values
            .map((v) => v.trim())
            .filter(Boolean)
            .filter((v) => !existingValues.has(v.toLowerCase()))
            .map((value) => ({
              id: crypto.randomUUID(),
              value,
            }));

          return {
            items: [...state.items, ...normalized],
          };
        }),

      toggleSelect: (id) =>
        set((state) => {
          const next = new Set(state.selectedIds);
          next.has(id) ? next.delete(id) : next.add(id);
          return { selectedIds: next };
        }),

      clearSelection: () => set({ selectedIds: new Set() }),

      deleteSelected: () =>
        set((state) => ({
          items: state.items.filter((item) => !state.selectedIds.has(item.id)),
          selectedIds: new Set(),
        })),

      deleteAll: () =>
        set({
          items: [],
          selectedIds: new Set(),
        }),

      /* =====================================================
         PRIZE POOL
      ===================================================== */
      prizes: [],
      activePrizeId: null,

      addPrize: ({ name, image }) =>
        set((state) => {
          const id = crypto.randomUUID();

          return {
            prizes: [
              ...state.prizes,
              {
                id,
                name,
                image,
                claimed: false,
                owner: null,
              },
            ],
            activePrizeId: state.activePrizeId ?? id,
          };
        }),

      setActivePrize: (id) =>
        set((state) => {
          const prize = state.prizes.find((p) => p.id === id);
          if (!prize || prize.claimed) return {};
          return { activePrizeId: id };
        }),

      assignPrizeOwner: (username) =>
        set((state) => {
          if (!state.activePrizeId) return state;

          /* -------------------------
             Mark prize as claimed
          ------------------------- */
          const updatedPrizes = state.prizes.map((p) =>
            p.id === state.activePrizeId
              ? { ...p, claimed: true, owner: username }
              : p
          );

          /* -------------------------
             Remove winner from users
          ------------------------- */
          const remainingUsers = state.items.filter(
            (item) => item.value !== username
          );

          /* -------------------------
             Move to next free prize
          ------------------------- */
          const nextFreePrize = updatedPrizes.find((p) => !p.claimed);

          return {
            prizes: updatedPrizes,
            items: remainingUsers,
            activePrizeId: nextFreePrize ? nextFreePrize.id : null,
            selectedIds: new Set(), // clear UI selection safely
          };
        }),

      /* 🗑 Delete prize safely */
      deletePrize: (id) =>
        set((state) => {
          const updated = state.prizes.filter((p) => p.id !== id);
          const nextActive =
            state.activePrizeId === id
              ? updated.find((p) => !p.claimed)?.id ?? null
              : state.activePrizeId;

          return {
            prizes: updated,
            activePrizeId: nextActive,
          };
        }),
    }),
    {
      name: "random-picker-data",

      /* =====================================================
         PERSIST ONLY DOMAIN DATA
      ===================================================== */
      partialize: (state) => ({
        items: state.items,
        prizes: state.prizes,
        activePrizeId: state.activePrizeId,
      }),

      /* =====================================================
         REHYDRATE SET SAFELY
      ===================================================== */
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.selectedIds = new Set();
        }
      },
    }
  )
);
