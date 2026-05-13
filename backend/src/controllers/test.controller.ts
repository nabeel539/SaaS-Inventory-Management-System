import { Request, Response } from 'express';
import prisma from '../services/prisma';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const testDatabaseConnection = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Simple query to verify connection
    const userCount = await prisma.user.count();
    
    sendSuccess(res, {
      connection: 'success',
      database: 'PostgreSQL (Neon)',
      stats: {
        users: userCount
      }
    }, 'Database connection verified successfully');
  } catch (error) {
    console.error('Database connection test error:', error);
    sendError(res, 'Database connection failed');
  }
};
