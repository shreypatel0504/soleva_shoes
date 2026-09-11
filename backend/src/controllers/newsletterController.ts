import { Request, Response } from 'express';
import { NewsletterSubscriber } from '../models/NewsletterSubscriber';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return sendError(res, 400, 'Please enter a valid email address');
    }

    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return sendSuccess({
        res,
        message: "You're already subscribed to our newsletter! Thank you.",
        data: { email: existing.email },
      });
    }

    const subscriber = await NewsletterSubscriber.create({
      email: email.toLowerCase().trim(),
    });

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Successfully subscribed to the SOLEVA insider list!',
      data: { email: subscriber.email },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};
