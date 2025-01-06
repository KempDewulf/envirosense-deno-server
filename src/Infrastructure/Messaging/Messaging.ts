import { Client } from "mqtt";
import "@std/dotenv";
import {
	DeviceConfigMessageHandler,
	DeviceLimitMessageHandler,
	MessageHandlerFactory,
	MessagingUseCaseRegistry,
} from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class Messaging {
	private client: Client;
	private messageHandlerFactory: MessageHandlerFactory;
	private readonly trackableHandlers = [DeviceLimitMessageHandler, DeviceConfigMessageHandler];

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
		if (this.trackableHandlers.some((handlerType) => handler instanceof handlerType)) {
			handler.setLastPublished(topic, message);
		}
		await this.client.publish(topic, message);
	}

	public async waitForMessage(topic: string, timeout: number): Promise<string | null> {
		await this.client.subscribe(topic);

		return await new Promise<string | null>((resolve) => {
			const timer = setTimeout(async () => {
				this.client.off("message", messageHandler);
				await this.client.unsubscribe(topic);
				resolve(null);
			}, timeout);

			const messageHandler = async (receivedTopic: string, payload: Uint8Array) => {
				if (receivedTopic === topic) {
					clearTimeout(timer);
					this.client.off("message", messageHandler);
					await this.client.unsubscribe(topic);
					resolve(new TextDecoder().decode(payload));
				}
			};

			this.client.on("message", messageHandler);
		});
	}
}
