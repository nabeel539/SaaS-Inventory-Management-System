import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  organizationId: string;
  name?: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface SignupBody {
  organizationName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateProductBody {
  name: string;
  sku: string;
  description?: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  lowStockThreshold?: number;
}

export interface UpdateProductBody {
  name?: string;
  sku?: string;
  description?: string;
  quantity?: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number;
}

export interface UpdateSettingsBody {
  defaultLowStockThreshold: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalInventoryQuantity: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalValuation: number;
}

export type AsyncHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;
