import { Request, Response } from 'express';
import { ContactInquiry } from '../models/ContactInquiry';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/authMiddleware';

export const submitInquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const inquiry = await ContactInquiry.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
    });

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Your message has been received! Our concierge team will reply shortly.',
      data: { inquiry },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const getInquiries = async (req: AuthRequest, res: Response) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    return sendSuccess({
      res,
      message: 'Inquiries retrieved',
      data: { inquiries },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const updateInquiryStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await ContactInquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!inquiry) return sendError(res, 404, 'Inquiry not found');

    return sendSuccess({
      res,
      message: 'Inquiry status updated',
      data: { inquiry },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};
