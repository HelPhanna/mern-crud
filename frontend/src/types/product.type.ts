export interface Product {
  _id: string;
  name: string;
  size: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: { name: string; _id: string };
  isActive: boolean;
}
