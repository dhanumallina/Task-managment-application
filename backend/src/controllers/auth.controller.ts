import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateTokenPair } from '../utils/tokens.js';
import {
  sendSuccess,
  sendError,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/response.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { verifyRefreshToken } from '../utils/tokens.js';
import type { AuthenticatedRequest } from '../types/index.js';

// ── Register ──────────────────────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return sendError(res, 'An account with this email already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  const tokenPayload = { userId: String(user._id), email: user.email, role: user.role };
  const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

  // Store refresh token hash
  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save();

  setRefreshTokenCookie(res, refreshToken);

  sendSuccess(
    res,
    { accessToken, user: user.toJSON() },
    'Account created successfully.',
    201
  );
});

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  const tokenPayload = { userId: String(user._id), email: user.email, role: user.role };
  const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save();

  setRefreshTokenCookie(res, refreshToken);

  sendSuccess(res, { accessToken, user: user.toJSON() }, 'Logged in successfully.');
});

// ── Logout ────────────────────────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  if (userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: '' });
  }
  clearRefreshTokenCookie(res);
  sendSuccess(res, null, 'Logged out successfully.');
});

// ── Refresh Token ─────────────────────────────────────────────────────────────
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return sendError(res, 'No refresh token provided.', 401);
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    return sendError(res, 'Invalid or expired refresh token.', 401);
  }

  const user = await User.findById(payload.userId).select('+refreshToken');
  if (!user || !user.refreshToken) {
    return sendError(res, 'Session expired. Please log in again.', 401);
  }

  const tokenPayload = { userId: String(user._id), email: user.email, role: user.role };
  const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(tokenPayload);

  user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
  await user.save();

  setRefreshTokenCookie(res, newRefreshToken);
  sendSuccess(res, { accessToken }, 'Token refreshed.');
});

// ── Get Me ────────────────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user?.userId);
  if (!user) {
    return sendError(res, 'User not found.', 404);
  }
  sendSuccess(res, { user: user.toJSON() }, 'User retrieved.');
});
