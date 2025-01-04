import { UpdateDeviceConfigInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { MessageHandler } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class DeviceConfigMessageHandler implements MessageHandler {
	private lastPublishedTopic?: string;
	private lastPublishedMessage?: string;

	constructor(private updateDeviceConfigUseCase: UseCase<UpdateDeviceConfigInput>) {}

	async handleMessage(topic: string, payload: string): Promise<void> {
		if (topic === this.lastPublishedTopic && payload === this.lastPublishedMessage) {
			this.lastPublishedTopic = undefined;
			this.lastPublishedMessage = undefined;
			return;
		}

		const deviceIdentifier = this.getDeviceId(topic);
		const configType = this.getConfigType(topic);
		const data = JSON.parse(payload);

		const input: UpdateDeviceConfigInput = {
			deviceDocumentId: deviceIdentifier,
			configType: configType,
			value: data.value,
		};

		await this.updateDeviceConfigUseCase.execute(input);
	}

	setLastPublished(topic: string, message: string): void {
        this.lastPublishedTopic = topic;
        this.lastPublishedMessage = message;
    }

	canHandle(topic: string): boolean {
		return topic.match(/devices\/.*\/config\/.*/) !== null;
	}

	private getDeviceId(topic: string): string {
		return topic.split("/")[1] ?? "";
	}

	private getConfigType(topic: string): string {
		return topic.split("/")[3] ?? "";
	}
}
