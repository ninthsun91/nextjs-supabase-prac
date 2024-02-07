import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log('middleware::getUser', user);

  // if user is signed in and the current path is "/"
  // then redirect to "/account"
  if (!!user && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/account', req.url));
  }

  // if user is not signed in and the current path is not "/"
  // then redirect to "/"
  if (user === null && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/account'],
}