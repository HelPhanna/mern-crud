import api from "../lib/axios";
import { type Category } from "../types/category.type";

export const getCategories = () => api.get<Category[]>("/categories");

export const createCategory = (data: Partial<Category>) =>
  api.post("/categories", data);

export const updateCategory = (id: string, data: Partial<Category>) =>
  api.put(`/categories/${id}`, data);

export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);
