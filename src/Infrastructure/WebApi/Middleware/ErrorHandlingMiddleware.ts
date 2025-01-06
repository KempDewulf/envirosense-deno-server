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
		let errorMessage = "An unexpected error occurred";
		let errorStatus = 500;

		if (isHttpError(exception)) {
			errorStatus = exception.status;
			errorMessage = exception.message;
		} else if (exception instanceof DomainException) {
			errorMessage = exception.message;
			errorStatus = 409;
		} else if (exception instanceof NotFoundException) {
			errorMessage = exception.message;
			errorStatus = 404;
		} else if (exception instanceof IllegalStateException) {
			errorMessage = exception.message;
			errorStatus = 400;
		} else if (exception instanceof Error) {
			errorMessage = exception.message;
		}

		context.response.status = errorStatus;
		context.response.body = { error: errorMessage };
		context.response.type = "json";
	}
}
