import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // cv/ (con barra): /cv a secas y /cvfoo sí pasan por el proxy
  matcher: '/((?!api|_next|_vercel|cv/|.*\\..*).*)',
};
