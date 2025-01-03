import { Messaging, MessagingUseCaseRegistry } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class MessagingBuilder {
    private static instance: Messaging;

    public static createInstance(registry: MessagingUseCaseRegistry): Messaging {
        if (!MessagingBuilder.instance) {
            MessagingBuilder.instance = new Messaging(registry);
        }
        return MessagingBuilder.instance;
    }

    public static getInstance(): Messaging {
        if (!MessagingBuilder.instance) {
            throw new Error("Messaging not initialized");
        }
        return MessagingBuilder.instance;
    }
}
