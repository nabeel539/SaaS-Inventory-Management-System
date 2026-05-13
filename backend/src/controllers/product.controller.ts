import { Response } from 'express';
import { AuthenticatedRequest, CreateProductBody, UpdateProductBody } from '../types';
import prisma from '../services/prisma';
import { sendSuccess, sendCreated, sendBadRequest, sendNotFound, sendError, sendConflict } from '../utils/apiResponse';

export const getProducts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendBadRequest(res, 'Unauthorized'); return; }

    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const page = typeof req.query.page === 'string' ? req.query.page : '1';
    const limit = typeof req.query.limit === 'string' ? req.query.limit : '10';
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      organizationId: req.user.organizationId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    sendSuccess(res, {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    sendError(res, 'Failed to fetch products');
  }
};

export const getProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendBadRequest(res, 'Unauthorized'); return; }

    const id = String(req.params.id);

    const product = await prisma.product.findFirst({
      where: {
        id,
        organizationId: req.user.organizationId,
      },
    });

    if (!product) {
      sendNotFound(res, 'Product not found');
      return;
    }

    sendSuccess(res, product);
  } catch (error) {
    console.error('Get product error:', error);
    sendError(res, 'Failed to fetch product');
  }
};

export const createProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendBadRequest(res, 'Unauthorized'); return; }

    const { name, sku, description, quantity, costPrice, sellingPrice, lowStockThreshold } = req.body as CreateProductBody;

    if (!name || !sku) {
      sendBadRequest(res, 'Name and SKU are required');
      return;
    }

    // Check for duplicate SKU within organization
    const existingProduct = await prisma.product.findFirst({
      where: {
        sku,
        organizationId: req.user.organizationId,
      },
    });

    if (existingProduct) {
      sendConflict(res, 'A product with this SKU already exists in your organization');
      return;
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description: description || null,
        quantity: quantity || 0,
        costPrice: costPrice || 0,
        sellingPrice: sellingPrice || 0,
        lowStockThreshold: lowStockThreshold ?? null,
        organizationId: req.user.organizationId,
      },
    });

    sendCreated(res, product, 'Product created successfully');
  } catch (error) {
    console.error('Create product error:', error);
    sendError(res, 'Failed to create product');
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendBadRequest(res, 'Unauthorized'); return; }

    const id = String(req.params.id);
    const updateData = req.body as UpdateProductBody;

    // Verify product belongs to organization
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        organizationId: req.user.organizationId,
      },
    });

    if (!existingProduct) {
      sendNotFound(res, 'Product not found');
      return;
    }

    // If SKU is being changed, check for duplicates
    if (updateData.sku && updateData.sku !== existingProduct.sku) {
      const duplicateSku = await prisma.product.findFirst({
        where: {
          sku: updateData.sku,
          organizationId: req.user.organizationId,
          id: { not: id },
        },
      });

      if (duplicateSku) {
        sendConflict(res, 'A product with this SKU already exists in your organization');
        return;
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        lowStockThreshold: updateData.lowStockThreshold ?? existingProduct.lowStockThreshold,
      },
    });

    sendSuccess(res, product, 'Product updated successfully');
  } catch (error) {
    console.error('Update product error:', error);
    sendError(res, 'Failed to update product');
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendBadRequest(res, 'Unauthorized'); return; }

    const id = String(req.params.id);

    // Verify product belongs to organization
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        organizationId: req.user.organizationId,
      },
    });

    if (!existingProduct) {
      sendNotFound(res, 'Product not found');
      return;
    }

    await prisma.product.delete({
      where: { id },
    });

    sendSuccess(res, null, 'Product deleted successfully');
  } catch (error) {
    console.error('Delete product error:', error);
    sendError(res, 'Failed to delete product');
  }
};
