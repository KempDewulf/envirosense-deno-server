import { DomainException } from 'EnviroSense/Domain/Shared/Exceptions/DomainException.ts';
import { NotFoundException } from 'EnviroSense/Domain/Shared/Exceptions/NotFoundException.ts';
import { IllegalStateException } from 'EnviroSense/Domain/Shared/Exceptions/IllegalStateException.ts';

import { Context, isHttpError } from '@oak/oak';

export async function errorHandlingMiddleware(
    context: Context<Record<string, any>, Record<string, any>>,
    next: () => any,
): Promise<void> {
    try {
        await next();
    } catch (exception) {
        if (isHttpError(exception)) {
            context.response.status = exception.status;
        } else if (exception instanceof DomainException) {
            context.response.body = { error: exception.message };
            context.response.status = 409;
        } else if (exception instanceof NotFoundException) {
            context.response.body = { error: exception.message };
            context.response.status = 404;
        } else if (exception instanceof IllegalStateException) {
            context.response.body = { error: exception.message };
            context.response.status = 400;
        } else {
            context.response.status = 500;
        }
        context.response.body = { error: exception.message };
        context.response.type = 'json';
    }
}

