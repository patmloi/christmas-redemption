import { Request, Response, NextFunction } from 'express';
import { AppError, AppErrorInterface } from '../errors/errors';

const isAppError = (error: any): error is AppErrorInterface => {
    return (
        error instanceof AppError && 
        typeof error.statusCode === 'number' &&
        typeof error.message === 'string'
    );
};

export const errorHandler = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction // required even if not used
) => {

  // Check if the error is one of our custom AppErrors
  if (isAppError(err)) {
    const { statusCode, name, message } = err;
    return res.status(statusCode).json({
        error: name,
        details: message 
    });
  }

  // Handle unexpected errors (e.g., errors from external libraries, database connection issues, etc.)
  console.error('An unhandled server error occurred:', err);
  return res.status(500).json({ 
    error: 'Internal Server Error',
    details: 'An unexpected error occurred.' 
  });
};