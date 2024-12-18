// deno-lint-ignore-file no-explicit-any
import { Context, isHttpError } from "@oak/oak";
import { DomainException, IllegalStateException, NotFoundException } from "EnviroSense/Domain/mod.ts";

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
		context.response.type = "json";
	}
}
