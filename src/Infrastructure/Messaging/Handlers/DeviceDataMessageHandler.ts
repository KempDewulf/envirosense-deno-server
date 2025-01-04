import { AirData } from "EnviroSense/Domain/mod.ts";
import { ProcessDeviceDataInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { MessageHandler } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class DeviceDataMessageHandler implements MessageHandler {
	constructor(private processDeviceDataUseCase: UseCase<ProcessDeviceDataInput>) {}
	setLastPublished(_topic: string, _message: string): void {
		throw new Error("Method not needed.");
	}

	async handleMessage(topic: string, payload: string): Promise<void> {
		const deviceIdentifier = this.getDeviceId(topic);
		const airData: AirData = JSON.parse(payload);

		const input: ProcessDeviceDataInput = {
			deviceIdentifier,
			airData,
		};

		await this.processDeviceDataUseCase.execute(input);
	}

	canHandle(topic: string): boolean {
		return topic.match(/devices\/.*\/data/) !== null;
	}

	private getDeviceId(topic: string): string {
		return topic.split("/")[1] || "";
	}
}
