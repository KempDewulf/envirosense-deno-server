import { Middleware } from '@oak/oak';

const validTokens = new Set([
  'your-secret-token-1',
  'your-secret-token-2',
]);

export const authMiddleware: Middleware = async (context, next) => {
  const authorization = context.request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.substring(7);
    if (validTokens.has(token)) {
      await next();
      return;
    }
  }
  context.response.status = 401;
  context.response.body = { error: 'Unauthorized' };
};