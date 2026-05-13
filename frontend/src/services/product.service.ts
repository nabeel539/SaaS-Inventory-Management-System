import api from './api';
import type { ApiResponse, Product, ProductsResponse, CreateProductPayload, UpdateProductPayload } from '../types';

export const productService = {
  getProducts: async (params?: { search?: string; page?: number; limit?: number }): Promise<ProductsResponse> => {
    const response = await api.get<ApiResponse<ProductsResponse>>('/products', { params });
    return response.data.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  createProduct: async (data: CreateProductPayload): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    return response.data.data;
  },

  updateProduct: async (id: string, data: UpdateProductPayload): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
