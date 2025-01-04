import { Client } from "mqtt";
import "@std/dotenv";
import { DeviceLimitMessageHandler, MessageHandlerFactory, MessagingUseCaseRegistry } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class Messaging {
	private client: Client;
	private messageHandlerFactory: MessageHandlerFactory;

	constructor(registry: MessagingUseCaseRegistry) {
		this.client = new Client({
			url: Deno.env.get("MQTT_BROKER"),
			username: Deno.env.get("MQTT_USERNAME"),
			password: Deno.env.get("MQTT_PASSWORD"),
		});
		this.messageHandlerFactory = new MessageHandlerFactory(registry);
	}

	public initialize(registry: MessagingUseCaseRegistry): void {
		this.messageHandlerFactory = new MessageHandlerFactory(registry);
	}

	public async connect(): Promise<void> {
		await this.client.connect();

		this.client.on("message", async (topic: string, payload: Uint8Array) => {
			const msg = new TextDecoder().decode(payload);
			const handler = this.messageHandlerFactory.getHandler(topic);
			await handler.handleMessage(topic, msg);
		});
	}

	public async subscribe(topic: string): Promise<void> {
		await this.client.subscribe(topic);
	}

	public async publish(topic: string, message: string): Promise<void> {
		const handler = this.messageHandlerFactory.getHandler(topic);
		if (handler instanceof DeviceLimitMessageHandler) {
			handler.setLastPublished(topic, message);
		}
		await this.client.publish(topic, message);
	}
}
