import {
	OutputPort,
	RoomQueryDto,
	RoomQueryRepository,
	ShowRoomLimitsInput,
	ShowRoomLimitsOutput,
	UpdateDeviceLimitInput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class ShowRoomLimits implements UseCase<ShowRoomLimitsInput> {
	private readonly _outputPort: OutputPort<ShowRoomLimitsOutput>;
	private readonly _roomRepository: RoomQueryRepository;
	private readonly _messaging: Messaging;
	private readonly _updateDeviceLimitUseCase: UseCase<UpdateDeviceLimitInput>;

	constructor(
		outputPort: OutputPort<ShowRoomLimitsOutput>,
		roomRepository: RoomQueryRepository,
		messaging: Messaging,
		updateDeviceLimitUseCase: UseCase<UpdateDeviceLimitInput>,
	) {
		this._outputPort = outputPort;
		this._roomRepository = roomRepository;
		this._messaging = messaging;
		this._updateDeviceLimitUseCase = updateDeviceLimitUseCase;
	}

	async execute(input: ShowRoomLimitsInput): Promise<void> {
		const roomOptional = await this._roomRepository.find(input.roomDocumentId);
		const roomDto = roomOptional.orElseThrow(
			() => new Error(`Room with ID ${input.roomDocumentId} not found.`),
		);

		if (!roomDto.devices.length) {
			throw new Error("Room has no devices");
		}

		// Collect all device limits
		const deviceLimits = new Map<string, Record<string, number>>();
		const failedDevices: string[] = [];

		for (const device of roomDto.devices) {
			try {
				const requestTopic = `devices/${device.identifier}/limits/request`;
				const responseTopic = `devices/${device.identifier}/limits/response`;

				await this._messaging.publish(requestTopic, "{}");
				const response = await this._messaging.waitForMessage(responseTopic, 5000);

				if (!response) {
					console.log(`⚠️ Device ${device.identifier} did not respond in time`);
					failedDevices.push(device.identifier);
					continue;
				}

				deviceLimits.set(device.identifier, JSON.parse(response));
			} catch (error) {
				console.log(`❌ Error getting limits for device ${device.identifier}:`, error);
				failedDevices.push(device.identifier);
			}
		}

		if (deviceLimits.size === 0) {
			throw new Error("No devices responded with limits");
		}

		// Get first device limits as reference
		// Get first successful device as reference
		const referenceDeviceId = Array.from(deviceLimits.keys())[0];
		if (!referenceDeviceId) {
			throw new Error("No reference device found");
		}

		const referenceLimits = deviceLimits.get(referenceDeviceId)!;

		console.log(`ℹ️ Using reference limits from device ${referenceDeviceId}:`, referenceLimits);
		if (failedDevices.length > 0) {
			console.log(`⚠️ Skipping sync for non-responding devices:`, failedDevices);
		}

		// Check and sync other responding devices
		for (const device of roomDto.devices) {
			if (failedDevices.includes(device.identifier)) continue;
			if (device.identifier === referenceDeviceId) continue;

			const currentLimits = deviceLimits.get(device.identifier)!;
			if (!this.areLimitsEqual(referenceLimits, currentLimits)) {
				await this.syncDeviceLimits(device.identifier, device.documentId, referenceLimits);
			}
		}

		const output = this.mapDtoToOutput(roomDto, referenceLimits);
		this._outputPort.present(output);
	}

	private areLimitsEqual(limits1: Record<string, number>, limits2: Record<string, number>): boolean {
		const keys1 = Object.keys(limits1);
		const keys2 = Object.keys(limits2);

		if (keys1.length !== keys2.length) {
			console.log("❌ Limits have different number of keys:", { limits1, limits2 });
			return false;
		}

		const areEqual = keys1.every((key) => limits1[key] === limits2[key]);
		if (!areEqual) {
			console.log("❌ Limits have different values:", { limits1, limits2 });
		}
		return areEqual;
	}

	private async syncDeviceLimits(deviceIdentifier: string, deviceDocumentId: string, limits: Record<string, number>): Promise<void> {
		console.log(`🔄 Syncing device ${deviceIdentifier} with limits:`, limits);
		for (const [limitType, value] of Object.entries(limits)) {
			console.log(`⚡ Setting ${limitType} to ${value}`);
			await this._updateDeviceLimitUseCase.execute({
				deviceDocumentId: deviceDocumentId,
				limitType,
				value,
			});
		}
		console.log(`✅ Device ${deviceIdentifier} sync complete`);
	}

	private mapDtoToOutput(dto: RoomQueryDto, limits: Record<string, string | number>): ShowRoomLimitsOutput {
		return {
			documentId: dto.documentId,
			limits,
		};
	}
}
