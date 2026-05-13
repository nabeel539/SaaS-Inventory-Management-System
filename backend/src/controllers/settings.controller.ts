import { Response } from 'express';
import { AuthenticatedRequest, UpdateSettingsBody } from '../types';
import prisma from '../services/prisma';
import { sendSuccess, sendBadRequest, sendError } from '../utils/apiResponse';

export const getSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendBadRequest(res, 'Unauthorized'); return; }

    const organization = await prisma.organization.findUnique({
      where: { id: req.user.organizationId },
      select: {
        id: true,
        name: true,
        defaultLowStockThreshold: true,
      },
    });

    if (!organization) {
      sendError(res, 'Organization not found', 404);
      return;
    }

    sendSuccess(res, organization);
  } catch (error) {
    console.error('Get settings error:', error);
    sendError(res, 'Failed to fetch settings');
  }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { sendBadRequest(res, 'Unauthorized'); return; }

    const { defaultLowStockThreshold } = req.body as UpdateSettingsBody;

    if (defaultLowStockThreshold === undefined || defaultLowStockThreshold === null) {
      sendBadRequest(res, 'Default low stock threshold is required');
      return;
    }

    if (typeof defaultLowStockThreshold !== 'number' || defaultLowStockThreshold < 0) {
      sendBadRequest(res, 'Default low stock threshold must be a non-negative number');
      return;
    }

    const organization = await prisma.organization.update({
      where: { id: req.user.organizationId },
      data: { defaultLowStockThreshold },
      select: {
        id: true,
        name: true,
        defaultLowStockThreshold: true,
      },
    });

    sendSuccess(res, organization, 'Settings updated successfully');
  } catch (error) {
    console.error('Update settings error:', error);
    sendError(res, 'Failed to update settings');
  }
};
