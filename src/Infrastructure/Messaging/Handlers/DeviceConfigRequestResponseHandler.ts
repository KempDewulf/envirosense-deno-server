import { MessageHandler } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class DeviceConfigRequestResponseHandler implements MessageHandler {
	// deno-lint-ignore require-await
	async handleMessage(): Promise<void> {
		return;
	}

	setLastPublished(): void {
		throw new Error("Method not implemented.");
	}

	canHandle(topic: string): boolean {
		return topic.includes("/config/request") || topic.includes("/config/response");
	}
}
