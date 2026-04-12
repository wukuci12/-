import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const SALT_ROUNDS = 10;

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: { id: string; email: string; username: string }): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { id: string; email: string; username: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; username: string };
    return decoded;
  } catch (error) {
    throw new AuthError('Invalid or expired token');
  }
}

export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const decoded = verifyToken(token);
    const user = await db.user.findUnique({
      where: { id: decoded.id },
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function registerUser(
  email: string,
  username: string,
  password: string,
  name?: string
): Promise<{ user: User; token: string }> {
  // 检查用户是否已存在
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new AuthError('Email already registered');
    }
    if (existingUser.username === username) {
      throw new AuthError('Username already taken');
    }
  }

  // 哈希密码
  const hashedPassword = await hashPassword(password);

  // 创建用户
  const user = await db.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      name: name || username,
      level: 'BEGINNER',
      points: 0,
      streak: 0,
    },
  });

  // 生成token
  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  });

  return { user, token };
}

export async function loginUser(
  emailOrUsername: string,
  password: string
): Promise<{ user: User; token: string }> {
  // 查找用户
  const user = await db.user.findFirst({
    where: {
      OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
    },
  });

  if (!user) {
    throw new AuthError('User not found');
  }

  // 验证密码
  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw new AuthError('Invalid password');
  }

  // 更新最后登录时间
  await db.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  // 生成token
  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  });

  return { user, token };
}