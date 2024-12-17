import { Middleware } from '@oak/oak';

const validTokens = new Set([
  Deno.env.get("API_KEY")
]);

export const authMiddleware: Middleware = async (context, next) => {
    console.log('⚡ Auth Middleware executing...');
  const authorization = context.request.headers.get('Authorization');

  if (!authorization?.startsWith('Bearer ')) {
    console.log('❌ No bearer token found');
    context.response.status = 401;
    context.response.body = { error: 'No authorization token provided' };
    return;
  }

  const token = authorization.substring(7);
  if (!validTokens.has(token)) {
    console.log('❌ Invalid token');
    context.response.status = 401;
    context.response.body = { error: 'Invalid token' };
    return;
  }

  console.log('✅ Valid token, proceeding...');
  await next();
};