import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class MessagingBuilder {
	private static instance: Messaging;

	public static createInstance(messaging: Messaging): void {
		MessagingBuilder.instance = messaging;
	}

	public static getInstance(): Messaging {
		if (!MessagingBuilder.instance) {
			throw new Error("Messaging not initialized.");
		}
		return MessagingBuilder.instance;
	}
}
