import { CartItem } from '@/types/cart';

const CART_STORAGE_KEY = 'mbst';
const EMPTY_CART: CartItem[] = [];

const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY_CART;

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener('storage', callback); // sync across tabs
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

export function getSnapshot(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedItems;

  cachedRaw = raw;
  try {
    cachedItems = raw ? JSON.parse(raw) : EMPTY_CART;
  } catch {
    cachedItems = EMPTY_CART;
  }
  return cachedItems;
}

export function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function write(items: CartItem[]) {
  const raw = JSON.stringify(items);
  try {
    localStorage.setItem(CART_STORAGE_KEY, raw);
  } catch {
    // Storage unavailable or full: keep the update in memory only
  }

  cachedRaw = raw;
  cachedItems = items;
  emit();
}

export function addItem(newItem: Omit<CartItem, 'quantity'>) {
  const current = getSnapshot();
  const exists = current.some((item) => item.id === newItem.id);

  if (!exists) {
    const newCart: CartItem[] = [...current, { ...newItem, quantity: 1 }];
    write(newCart);
    return;
  }

  const updatedCart = current.map((item) =>
    item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item,
  );
  write(updatedCart);
}

export function removeItem(id: string) {
  write(getSnapshot().filter((item) => item.id !== id));
}
