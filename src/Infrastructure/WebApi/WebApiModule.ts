import { Module } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { authMiddleware, cleanResponseMiddleware, endpoints, errorHandlingMiddleware } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { Application, send } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";

export class WebApiModule implements Module {
	private readonly _port: number;

	constructor(port: number) {
		this._port = port;
	}

	run(): Promise<void> {
		console.log("WebApi module started");
		console.log(`WebApi running on port http://127.0.0.1:${this._port}`);

		const app = new Application();

		app.use(errorHandlingMiddleware);
		app.use(oakCors(
			{
				origin: "*",
				optionsSuccessStatus: 200,
				methods: ["*"],
				allowedHeaders: ["*"],
				exposedHeaders: ["Location", "Content-Type", "*"],
			},
		));
		app.use(authMiddleware);
		app.use(cleanResponseMiddleware);

		// Static file serving middleware
		app.use(async (context, next) => {
			const filePath = context.request.url.pathname;
			try {
				await send(context, filePath, {
					root: `${Deno.cwd()}/`,
					index: "index.html",
				});
			} catch {
				await next();
			}
		});

		const router = endpoints();

		app.use(router.routes());
		app.use(router.allowedMethods());

		return app.listen({ port: this._port });
	}
}
