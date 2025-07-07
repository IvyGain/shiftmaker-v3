import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JwtPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET!;

// Generate JWT token
export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Verify JWT token
export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    throw new Error('Invalid token');
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

// Type for route handler
type RouteHandler = (req: Request & { user?: JwtPayload }, res?: Response) => Promise<Response> | Response;

// Middleware to verify user authentication
export function requireAuth(handler: RouteHandler) {
  return async (req: Request & { user?: JwtPayload }) => {
    try {
      const token = extractTokenFromHeader(req.headers.get('authorization'));
      
      if (!token) {
        return new Response(JSON.stringify({ success: false, error: 'No token provided' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const decoded = verifyToken(token);
      req.user = decoded;
      
      return handler(req);
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}

// Middleware to require admin role
export function requireAdmin(handler: RouteHandler) {
  return requireAuth(async (req: Request & { user?: JwtPayload }) => {
    if (req.user?.role !== 'manager') {
      return new Response(JSON.stringify({ success: false, error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return handler(req);
  });
}