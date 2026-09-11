import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    return sendSuccess({
      res,
      message: 'Categories fetched successfully',
      data: { categories },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, image, description, order } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await Category.create({
      name,
      slug,
      image,
      description,
      order: order || 0,
    });

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) return sendError(res, 404, 'Category not found');

    return sendSuccess({
      res,
      message: 'Category updated successfully',
      data: { category },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return sendError(res, 404, 'Category not found');

    return sendSuccess({
      res,
      message: 'Category deleted successfully',
      data: null,
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};
