export interface CartItem {
  id: string; // `${phoneId}-${storage}-${color}`
  phoneId: string;
  name: string;
  brand: string;
  imageUrl: string;
  price: number;
  storage: string;
  color: string;
  quantity: number;
}
