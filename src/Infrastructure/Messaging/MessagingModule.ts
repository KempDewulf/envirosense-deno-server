import { Module } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
	Messaging,
	MessagingBuilder,
	MessagingUseCaseFactory,
	MessagingUseCaseRegistry,
} from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class MessagingModule implements Module {
	private messaging: Messaging;
	private useCaseFactory: MessagingUseCaseFactory;

	constructor() {
		// Create empty registry first
		const emptyRegistry: MessagingUseCaseRegistry = {
			processDeviceDataUseCase: undefined,
			updateDeviceLimitUseCase: undefined,
			updateDeviceConfigUseCase: undefined,
		};

		this.messaging = new Messaging(emptyRegistry);
		MessagingBuilder.createInstance(this.messaging);

		// Create factory with dependencies
		this.useCaseFactory = new MessagingUseCaseFactory();

		// Create complete registry
		const registry: MessagingUseCaseRegistry = {
			processDeviceDataUseCase: this.useCaseFactory.createProcessDeviceDataUseCase(),
			updateDeviceLimitUseCase: this.useCaseFactory.updateDeviceLimitUseCase(),
			updateDeviceConfigUseCase: this.useCaseFactory.updateDeviceConfigUseCase(),
		};

		// Re-initialize messaging with complete registry
		this.messaging.initialize(registry);
	}

	public async run(): Promise<void> {
		console.log("Messaging module started");
		await this.messaging.connect();
		await this.messaging.subscribe("devices/+/data");
		await this.messaging.subscribe("devices/+/limits/+");
		await this.messaging.subscribe("devices/+/config/+");
	}
}
