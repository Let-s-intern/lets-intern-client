import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;
const MENTOR_URL = process.env.NEXT_PUBLIC_MENTOR_URL;
const IS_DEV = process.env.NODE_ENV !== 'production';

const REDIRECT_STATUS = IS_DEV ? 307 : 308;

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

function redirect(url: string) {
  const response = NextResponse.redirect(url, REDIRECT_STATUS);
  if (IS_DEV) {
    response.headers.set('Cache-Control', 'no-store');
  }
  return response;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (ADMIN_URL && pathname.startsWith('/admin')) {
    return redirect(buildRedirect(ADMIN_URL, pathname, search, '/admin'));
  }

  if (MENTOR_URL && pathname.startsWith('/mentor')) {
    return redirect(buildRedirect(MENTOR_URL, pathname, search, '/mentor'));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/mentor/:path*'],
};
