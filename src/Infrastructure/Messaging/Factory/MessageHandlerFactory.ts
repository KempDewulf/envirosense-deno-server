import {
	DeviceConfigMessageHandler,
	DeviceConfigRequestResponseHandler,
	DeviceDataMessageHandler,
	DeviceLimitMessageHandler,
	DeviceLimitRequestResponseHandler,
	MessageHandler,
	MessagingUseCaseRegistry,
} from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class MessageHandlerFactory {
	private handlers: MessageHandler[] = [];

	constructor(useCaseRegistry: MessagingUseCaseRegistry) {
		this.handlers = [
			new DeviceLimitRequestResponseHandler(),
			new DeviceConfigRequestResponseHandler(),
			new DeviceDataMessageHandler(useCaseRegistry.processDeviceDataUseCase!),
			new DeviceLimitMessageHandler(useCaseRegistry.updateDeviceLimitUseCase!),
			new DeviceConfigMessageHandler(useCaseRegistry.updateDeviceConfigUseCase!),
		];
	}

	getHandler(topic: string): MessageHandler {
		const handler = this.handlers.find((h) => h.canHandle(topic));
		if (!handler) {
			throw new Error(`No handler found for topic: ${topic}.`);
		}
		return handler;
	}
}
