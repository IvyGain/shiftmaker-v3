// Lark API response types
export interface LarkTableRecord {
  record_id: string;
  fields: Record<string, unknown>;
  created_time?: string;
  updated_time?: string;
}

export interface LarkTableResponse {
  items?: LarkTableRecord[];
  has_more?: boolean;
  page_token?: string;
}

// Request types for Next.js API routes
export interface NextRequest extends Request {
  user?: {
    userId: string;
    name: string;
    role: 'manager' | 'employee';
  };
}

export interface RouteContext {
  params: Record<string, string>;
}