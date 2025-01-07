import { MessageHandler } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class DeviceLimitRequestResponseHandler implements MessageHandler {
	// deno-lint-ignore require-await
	async handleMessage(): Promise<void> {
		return;
	}

	setLastPublished(): void {
		throw new Error("Method not implemented.");
	}

	canHandle(topic: string): boolean {
		return topic.includes("/limits/request") || topic.includes("/limits/response");
	}
}
