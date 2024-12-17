import { Middleware } from '@oak/oak';

// Debug: Log environment variable during initialization
const apiKey = Deno.env.get("API_KEY");
console.log('Loading API_KEY:', apiKey);

const PUBLIC_PATHS = new Set([
  '/',
  '/openapi.yml',
]);

const validTokens = new Set([
  apiKey // Store the value, not the getter
]);

export const authMiddleware: Middleware = async (context, next) => {
  console.log('⚡ Auth Middleware executing...');
  console.log('🔑 Valid tokens:', Array.from(validTokens)); // Debug: Log valid tokens

  const path = context.request.url.pathname;

  if (PUBLIC_PATHS.has(path)) {
    console.log(`⚡ Skipping auth for public path: ${path}`);
    await next();
    return;
  }

  console.log(`⚡ Checking auth for path: ${path}`);
  const authorization = context.request.headers.get('Authorization');

  if (!authorization?.startsWith('Bearer ')) {
    console.log('❌ No bearer token found');
    context.response.status = 401;
    context.response.body = { error: 'No authorization token provided' };
    return;
  }

  const token = authorization.substring(7);
  console.log('🔑 Received token:', token); // Debug: Log received token

  if (!validTokens.has(token)) {
    console.log('❌ Invalid token');
    console.log('Expected one of:', Array.from(validTokens)); // Debug: Log expected tokens
    context.response.status = 401;
    context.response.body = { error: 'Invalid token' };
    return;
  }

  console.log('✅ Valid token, proceeding...');
  await next();
};