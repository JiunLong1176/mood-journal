import { NextResponse, type NextRequest } from 'next/server';

// No auth required — personal single-user app
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)'],
};
