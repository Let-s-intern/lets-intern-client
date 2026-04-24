import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;
const MENTOR_URL = process.env.NEXT_PUBLIC_MENTOR_URL;

function buildRedirect(
  base: string,
  pathname: string,
  search: string,
  prefix: string,
) {
  const stripped = pathname.replace(new RegExp(`^${prefix}`), '') || '/';
  const target = new URL(base);
  target.pathname = (target.pathname.replace(/\/$/, '') + stripped) || '/';
  target.search = search;
  return target.toString();
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (ADMIN_URL && pathname.startsWith('/admin')) {
    return NextResponse.redirect(
      buildRedirect(ADMIN_URL, pathname, search, '/admin'),
      308,
    );
  }

  if (MENTOR_URL && pathname.startsWith('/mentor')) {
    return NextResponse.redirect(
      buildRedirect(MENTOR_URL, pathname, search, '/mentor'),
      308,
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/mentor/:path*'],
};
