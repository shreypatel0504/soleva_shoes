                                                      import { Response } from 'express';

export interface ApiResponseOptions<T = any> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export const sendSuccess = <T>({
  res,
  statusCode = 200,
  message = 'Success',
  data,
  pagination,
}: ApiResponseOptions<T>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
    ...(pagination !== undefined ? { pagination } : {}),
  });
};

export const sendError = (
  res: Response,
  statusCode = 500,
  message = 'Something went wrong',
  error: any = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error || {},
  });
};
