import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/authMiddleware';

const sendTokenResponse = (user: any, statusCode: number, res: Response, message: string) => {
  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  res.cookie('token', token, cookieOptions);

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    addresses: user.addresses,
  };

  return sendSuccess({
    res,
    statusCode,
    message,
    data: {
      user: userData,
      token,
    },
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'An account with this email address already exists.');
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: 'customer',
    });

    return sendTokenResponse(user, 201, res, 'Registration successful! Welcome to SOLEVA.');
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Account has been deactivated. Please contact support.');
    }

    return sendTokenResponse(user, 200, res, 'Login successful.');
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });

  return sendSuccess({
    res,
    message: 'Logged out successfully.',
    data: null,
  });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return sendError(res, 401, 'Unauthorized');
  }

  return sendSuccess({
    res,
    message: 'User profile retrieved',
    data: {
      user: req.user,
    },
  });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return sendError(res, 404, 'User not found');

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    return sendSuccess({
      res,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) return sendError(res, 404, 'User not found');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 400, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess({
      res,
      message: 'Password changed successfully',
      data: null,
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Return 200 so attackers cannot enumerate valid emails
      return sendSuccess({
        res,
        message: 'If an account with that email exists, password reset instructions have been generated.',
        data: null,
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save({ validateBeforeSave: false });

    return sendSuccess({
      res,
      message: 'Password reset token generated.',
      data: {
        resetToken,
      },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return sendError(res, 400, 'Invalid or expired password reset token.');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return sendSuccess({
      res,
      message: 'Password has been reset successfully. You can now log in with your new password.',
      data: null,
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, 'User not found');

    const isFirstAddress = user.addresses.length === 0;
    const newAddress = {
      ...req.body,
      isDefault: req.body.isDefault || isFirstAddress,
    };

    if (newAddress.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(newAddress);
    await user.save();

    return sendSuccess({
      res,
      message: 'Address added successfully',
      data: { addresses: user.addresses },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 401, 'Unauthorized');

    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, 'User not found');

    user.addresses = user.addresses.filter(
      (addr) => addr._id?.toString() !== addressId
    ) as any;

    await user.save();

    return sendSuccess({
      res,
      message: 'Address removed successfully',
      data: { addresses: user.addresses },
    });
  } catch (err: any) {
    return sendError(res, 500, err.message);
  }
};
