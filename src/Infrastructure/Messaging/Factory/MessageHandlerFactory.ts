import { DeviceDataMessageHandler, DeviceLimitMessageHandler, DeviceBrightnessMessageHandler, MessageHandler, MessagingUseCaseRegistry } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { DeviceUiModeMessageHandler } from "EnviroSense/Infrastructure/Messaging/Handlers/DeviceUiModeMessageHandler.ts";

export class MessageHandlerFactory {
    private handlers: MessageHandler[] = [];

    constructor(useCaseRegistry: MessagingUseCaseRegistry) {
        this.handlers = [
            new DeviceDataMessageHandler(useCaseRegistry.processDeviceDataUseCase!),
            new DeviceLimitMessageHandler(useCaseRegistry.updateDeviceLimitUseCase!),
            new DeviceUiModeMessageHandler(useCaseRegistry.updateDeviceUiModeUseCase!),
            new DeviceBrightnessMessageHandler(useCaseRegistry.updateDeviceBrightnessUseCase!),
        ];
    }

    getHandler(topic: string): MessageHandler {
        const handler = this.handlers.find(h => h.canHandle(topic));
        if (!handler) {
            throw new Error(`No handler found for topic: ${topic}`);
        }
        return handler;
    }
}
