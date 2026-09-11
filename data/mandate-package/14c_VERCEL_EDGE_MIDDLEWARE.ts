// Vercel Edge Middleware AST Adapter
import { NextResponse } from 'next/server';
export function middleware(request: Request) {
  return NextResponse.next();
}