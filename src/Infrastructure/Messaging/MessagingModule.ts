import { Module } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { Messaging, MessagingBuilder, MessagingUseCaseFactory, MessagingUseCaseRegistry } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class MessagingModule implements Module {
    private messaging: Messaging;
    private useCaseFactory: MessagingUseCaseFactory;

    constructor() {
        this.useCaseFactory = new MessagingUseCaseFactory();
        const registry: MessagingUseCaseRegistry = {
            processDeviceDataUseCase: this.useCaseFactory.createProcessDeviceDataUseCase(),
            updateDeviceLimitUseCase: this.useCaseFactory.updateDeviceLimitUseCase()
        };
        this.messaging = MessagingBuilder.createInstance(registry);
    }

    public async run(): Promise<void> {
        console.log("Messaging module started");
        await this.messaging.connect();
        await this.messaging.subscribe("devices/+/data");
        await this.messaging.subscribe("devices/+/limits/+");
    }
}
