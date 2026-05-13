import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { verifyToken } from '../services/auth.service';
import { sendUnauthorized } from '../utils/apiResponse';
import prisma from '../services/prisma';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendUnauthorized(res, 'Access token is required');
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = verifyToken(token);

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        organizationId: true,
      },
    });

    if (!user) {
      sendUnauthorized(res, 'User no longer exists');
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    sendUnauthorized(res, 'Invalid or expired token');
    return;
  }
};
