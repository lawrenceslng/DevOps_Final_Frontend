import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  quantity: number;
}

export interface StoreState {
  userEmail: string;
  cart: CartItem[];
  setUserEmail: (email: string) => void;
  addToCart: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  isLoggedIn: () => boolean;
}

const store = (set: (state: Partial<StoreState>) => void, get: () => StoreState): StoreState => ({
  userEmail: '',
  cart: [],
  setUserEmail: (email: string) => set({ userEmail: email }),
  addToCart: (productId: number, quantity: number) => {
    const cart = get().cart;
    const existingItem = cart.find((item: CartItem) => item.id === productId);
    
    if (existingItem) {
      set({
        cart: cart.map((item: CartItem) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { id: productId, quantity }] });
    }
  },
  removeFromCart: (productId: number) =>
    set({ cart: get().cart.filter((item: CartItem) => item.id !== productId) }),
  clearCart: () => set({ cart: [] }),
  isLoggedIn: () => get().userEmail !== '',
});

export const useStore = create<StoreState>()(
  persist(store, {
    name: 'blue-bay-storage',
  })
);