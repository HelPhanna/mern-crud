import api from "../lib/axios";
import { type Product } from "../types/product.type";

export const getProducts = () => api.get<Product[]>("/products");

export const createProduct = (data: Partial<Product>) =>
  api.post("/products", data);

export const updateProduct = (id: string, data: Partial<Product>) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id: string) => api.delete(`/products/${id}`);
