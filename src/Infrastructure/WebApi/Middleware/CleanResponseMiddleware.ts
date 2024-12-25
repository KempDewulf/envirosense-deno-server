import { Middleware } from "@oak/oak";

const FIELDS_TO_REMOVE = ["publishedAt", "createdAt", "updatedAt"];

const cleanObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObject(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const cleaned = { ...obj };
    FIELDS_TO_REMOVE.forEach(field => delete cleaned[field]);

    for (const key in cleaned) {
      cleaned[key] = cleanObject(cleaned[key]);
    }

    return cleaned;
  }

  return obj;
};

export const cleanResponseMiddleware: Middleware = async (context, next) => {
  await next();

  if (context.response.body && typeof context.response.body === 'object') {
    context.response.body = cleanObject(context.response.body);
  }
};
