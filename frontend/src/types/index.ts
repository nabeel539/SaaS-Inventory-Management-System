export interface User {
  id: string;
  email: string;
  name?: string | null;
  organizationId: string;
  organizationName: string;
  defaultLowStockThreshold?: number;
}

export interface Organization {
  id: string;
  name: string;
  defaultLowStockThreshold: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  lowStockThreshold: number | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalInventoryQuantity: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalValuation: number;
  lowStockItems: LowStockItem[];
}

export interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  threshold: number;
  status: 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupPayload {
  organizationName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  description?: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  lowStockThreshold?: number;
}

export interface UpdateProductPayload {
  name?: string;
  sku?: string;
  description?: string;
  quantity?: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
}

export interface UpdateSettingsPayload {
  defaultLowStockThreshold: number;
}

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
