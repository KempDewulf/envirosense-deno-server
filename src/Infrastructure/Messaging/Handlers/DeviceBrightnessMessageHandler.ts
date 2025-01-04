import { UpdateDeviceBrightnessInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { MessageHandler } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class DeviceBrightnessMessageHandler implements MessageHandler {
	private lastPublishedTopic?: string;
	private lastPublishedMessage?: string;

	constructor(private updateDeviceBrightnessUseCase: UseCase<UpdateDeviceBrightnessInput>) {}

	async handleMessage(topic: string, payload: string): Promise<void> {
		if (topic === this.lastPublishedTopic && payload === this.lastPublishedMessage) {
			this.lastPublishedTopic = undefined;
			this.lastPublishedMessage = undefined;
			return;
		}

		const deviceIdentifier = this.getDeviceId(topic);
		const data = JSON.parse(payload);

		const input: UpdateDeviceBrightnessInput = {
			deviceDocumentId: deviceIdentifier,
			value: data.value,
		};

		await this.updateDeviceBrightnessUseCase.execute(input);
	}

	setLastPublished(topic: string, message: string): void {
		this.lastPublishedTopic = topic;
		this.lastPublishedMessage = message;
	}

	canHandle(topic: string): boolean {
		return topic.match(/^devices\/[^/]+\/config\/brightness$/) !== null;
	}

	private getDeviceId(topic: string): string {
		return topic.split("/")[1] ?? "";
	}
}
