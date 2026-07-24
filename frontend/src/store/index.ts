'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { authApi } from '@/services';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<User>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      setAuth: (user, token) => {
        localStorage.setItem('pawcare_token', token);
        set({ user, token, isLoading: false });
      },
      logout: () => {
        localStorage.removeItem('pawcare_token');
        set({ user: null, token: null, isLoading: false });
      },
      hydrate: async () => {
        const token = localStorage.getItem('pawcare_token') || get().token;
        if (!token) {
          set({ isLoading: false, user: null, token: null });
          return;
        }
        try {
          localStorage.setItem('pawcare_token', token);
          const res = await authApi.me();
          set({ user: res.data, token, isLoading: false });
        } catch {
          localStorage.removeItem('pawcare_token');
          set({ user: null, token: null, isLoading: false });
        }
      },
      login: async (email, password) => {
        const res = await authApi.login(email, password);
        get().setAuth(res.data.user, res.data.token);
        return res.data.user;
      },
      register: async (data) => {
        const res = await authApi.register(data);
        get().setAuth(res.data.user, res.data.token);
        return res.data.user;
      },
    }),
    {
      name: 'pawcare-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
);

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, qty = 1) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.productId === item.productId);
        if (idx >= 0) items[idx].quantity += qty;
        else items.push({ ...item, quantity: qty });
        set({ items });
      },
      removeItem: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      updateQty: (productId, quantity) => {
        if (quantity <= 0) return get().removeItem(productId);
        set({
          items: get().items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        });
      },
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'pawcare-cart' }
  )
);
