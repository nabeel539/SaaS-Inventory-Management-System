import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, message = 'Internal Server Error', statusCode = 500, errors?: any) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export const sendCreated = (res: Response, data: any, message = 'Created successfully') => {
  return sendSuccess(res, data, message, 201);
};

export const sendNotFound = (res: Response, message = 'Resource not found') => {
  return sendError(res, message, 404);
};

export const sendUnauthorized = (res: Response, message = 'Unauthorized') => {
  return sendError(res, message, 401);
};

export const sendBadRequest = (res: Response, message = 'Bad request', errors?: any) => {
  return sendError(res, message, 400, errors);
};

export const sendConflict = (res: Response, message = 'Resource already exists') => {
  return sendError(res, message, 409);
};
