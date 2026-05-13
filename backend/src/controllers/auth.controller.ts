import { Response } from 'express';
import { AuthenticatedRequest, SignupBody, LoginBody } from '../types';
import prisma from '../services/prisma';
import { hashPassword, comparePassword, generateToken } from '../services/auth.service';
import { sendSuccess, sendCreated, sendBadRequest, sendUnauthorized, sendConflict, sendError } from '../utils/apiResponse';

export const signup = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const body = req.body as SignupBody;
    const organizationName = body.organizationName?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const confirmPassword = body.confirmPassword;

    // Validation
    if (!organizationName || !email || !password || !confirmPassword) {
      sendBadRequest(res, 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      sendBadRequest(res, 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      sendBadRequest(res, 'Password must be at least 6 characters');
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      sendConflict(res, 'User with this email already exists');
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create organization and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: organizationName,
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          organizationId: organization.id,
        },
      });

      return { organization, user };
    });

    // Generate token
    const token = generateToken({
      id: result.user.id,
      email: result.user.email,
      organizationId: result.organization.id,
    });

    sendCreated(res, {
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name || null,
        organizationId: result.organization.id,
        organizationName: result.organization.name,
      },
    }, 'Account created successfully');
  } catch (error: any) {
    console.error('Signup error details:', error);
    
    // Check for specific Prisma errors
    if (error.code === 'P2002') {
      sendConflict(res, 'A user with this email or an organization with this name already exists');
      return;
    }

    sendError(res, process.env.NODE_ENV === 'development' ? `Signup failed: ${error.message}` : 'Failed to create account');
  }
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginBody;

    if (!email || !password) {
      sendBadRequest(res, 'Email and password are required');
      return;
    }

    // Find user with organization
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      organizationId: user.organizationId,
    });

    sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organizationId: user.organizationId,
        organizationName: user.organization.name,
      },
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 'Failed to login');
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            defaultLowStockThreshold: true,
          },
        },
      },
    });

    if (!user) {
      sendUnauthorized(res, 'User not found');
      return;
    }

    sendSuccess(res, {
      id: user.id,
      email: user.email,
      name: user.name,
      organizationId: user.organizationId,
      organizationName: user.organization.name,
      defaultLowStockThreshold: user.organization.defaultLowStockThreshold,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    sendError(res, 'Failed to get user info');
  }
};
