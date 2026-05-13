import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import prisma from '../services/prisma';
import { sendSuccess, sendBadRequest, sendError } from '../utils/apiResponse';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendBadRequest(res, 'Unauthorized'); return; }

    const organizationId = req.user.organizationId;

    // Get organization's default threshold
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { defaultLowStockThreshold: true },
    });

    const defaultThreshold = organization?.defaultLowStockThreshold ?? 10;

    // Get all products for the organization
    const products = await prisma.product.findMany({
      where: { organizationId },
    });

    const totalProducts = products.length;
    const totalInventoryQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalValuation = products.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);
    const outOfStockCount = products.filter(p => p.quantity === 0).length;

    // Low stock: quantity > 0 AND quantity <= threshold (product threshold or org default)
    const lowStockProducts = products.filter(p => {
      const threshold = p.lowStockThreshold ?? defaultThreshold;
      return p.quantity > 0 && p.quantity <= threshold;
    });

    // Critical: out of stock OR very low (for the low stock items table)
    const lowStockItems = products
      .filter(p => {
        const threshold = p.lowStockThreshold ?? defaultThreshold;
        return p.quantity <= threshold;
      })
      .map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
        threshold: p.lowStockThreshold ?? defaultThreshold,
        status: p.quantity === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
      }))
      .sort((a, b) => a.quantity - b.quantity);

    sendSuccess(res, {
      totalProducts,
      totalInventoryQuantity,
      lowStockCount: lowStockProducts.length + outOfStockCount,
      outOfStockCount,
      totalValuation,
      lowStockItems,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    sendError(res, 'Failed to fetch dashboard stats');
  }
};
