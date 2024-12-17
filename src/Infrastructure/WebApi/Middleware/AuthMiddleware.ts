import { Middleware } from '@oak/oak';

const validTokens = new Set([
  Deno.env.get("API_KEY")
]);

export const authMiddleware: Middleware = async (context, next) => {
  const authorization = context.request.headers.get('Authorization');

  if (!authorization?.startsWith('Bearer ')) {
    context.response.status = 401;
    context.response.body = { error: 'No authorization token provided' };
    return;
  }

  const token = authorization.substring(7);
  if (!validTokens.has(token)) {
    context.response.status = 401;
    context.response.body = { error: 'Invalid token' };
    return;
  }

  await next();
};