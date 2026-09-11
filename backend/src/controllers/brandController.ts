import { Request, Response } from 'express';
import { Brand } from '../models/Brand';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
    return sendSuccess({
      res,
      message: 'Brands fetched successfully',
      data: { brands },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name, logo, description } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const brand = await Brand.create({
      name,
      slug,
      logo: logo || '',
      description: description || '',
    });

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Brand created successfully',
      data: { brand },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};
