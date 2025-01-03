import { UpdateDeviceLimitInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { MessageHandler } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class DeviceLimitMessageHandler implements MessageHandler {
	constructor(private updateDeviceLimitUseCase: UseCase<UpdateDeviceLimitInput>) {}

	async handleMessage(topic: string, payload: string): Promise<void> {
		const deviceIdentifier = this.getDeviceId(topic);
		const limitType = this.getLimitType(topic);
		const data = JSON.parse(payload);

		const input: UpdateDeviceLimitInput = {
			deviceDocumentId: deviceIdentifier,
			limitType: limitType,
			value: data.value,
		};

		await this.updateDeviceLimitUseCase.execute(input);
	}

	canHandle(topic: string): boolean {
		return topic.match(/devices\/.*\/limits\/.*/) !== null;
	}

	private getDeviceId(topic: string): string {
		return topic.split("/")[1] ?? "";
	}

	private getLimitType(topic: string): string {
		return topic.split("/")[3] ?? "";
	}
}
