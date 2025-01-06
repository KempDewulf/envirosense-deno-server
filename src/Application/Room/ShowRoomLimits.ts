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
import { NotFoundException } from "EnviroSense/Domain/mod.ts";
import { NoDevicesRespondedError } from "EnviroSense/Domain/Shared/Exceptions/NoDevicesRespondedError.ts";

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
		const room = (await this._roomRepository.find(input.roomDocumentId)).orElseThrow(() =>
			new NotFoundException(`Room with ID ${input.roomDocumentId} not found.`)
		);

		this.validateRoomHasDevices(room);

		const { deviceLimits, failedDevices } = await this.collectDeviceLimits(room);

		if (deviceLimits.size === 0) {
			throw new NoDevicesRespondedError("No devices responded with limits");
		}

		const referenceDevice = this.getReferenceLimits(deviceLimits);
		await this.syncDevicesWithReference(room, deviceLimits, referenceDevice, failedDevices);

		const output = this.mapDtoToOutput(room, referenceDevice.limits, failedDevices);
		this._outputPort.present(output);
	}

	private validateRoomHasDevices(room: RoomQueryDto): void {
		if (!room.devices.length) {
			throw new NotFoundException("Room has no devices");
		}
	}

	private async collectDeviceLimits(room: RoomQueryDto): Promise<{
		deviceLimits: Map<string, Record<string, number>>;
		failedDevices: string[];
	}> {
		const deviceLimits = new Map<string, Record<string, number>>();
		const failedDevices: string[] = [];

		for (const device of room.devices) {
			try {
				const limits = await this.requestDeviceLimits(device.identifier);
				deviceLimits.set(device.identifier, limits);
			} catch (_error) {
				console.log(`❌ Error getting limits for device ${device.identifier}`);
				failedDevices.push(device.identifier);
			}
		}

		return { deviceLimits, failedDevices };
	}

	private async requestDeviceLimits(deviceId: string): Promise<Record<string, number>> {
		const requestTopic = `devices/${deviceId}/limits/request`;
		const responseTopic = `devices/${deviceId}/limits/response`;

		await this._messaging.publish(requestTopic, "{}");
		const response = await this._messaging.waitForMessage(responseTopic, 5000);

		if (!response) {
			throw new NoDevicesRespondedError(`Device ${deviceId} did not respond in time`);
		}

		return JSON.parse(response);
	}

	private getReferenceLimits(deviceLimits: Map<string, Record<string, number>>): {
		id: string;
		limits: Record<string, number>;
	} {
		const referenceId = Array.from(deviceLimits.keys())[0];
		if (!referenceId) {
			throw new NotFoundException("No reference device found");
		}

		return {
			id: referenceId,
			limits: deviceLimits.get(referenceId)!,
		};
	}

	private async syncDevicesWithReference(
		room: RoomQueryDto,
		deviceLimits: Map<string, Record<string, number>>,
		reference: { id: string; limits: Record<string, number> },
		failedDevices: string[],
	): Promise<void> {
		console.log(`ℹ️ Using reference limits from device ${reference.id}:`, reference.limits);

		if (failedDevices.length > 0) {
			console.log(`⚠️ Skipping sync for non-responding devices:`, failedDevices);
		}

		for (const device of room.devices) {
			if (this.shouldSkipDevice(device.identifier, reference.id, failedDevices)) continue;

			const currentLimits = deviceLimits.get(device.identifier)!;
			if (!this.areLimitsEqual(reference.limits, currentLimits)) {
				await this.syncDeviceLimits(device.identifier, device.documentId, reference.limits);
			}
		}
	}

	private shouldSkipDevice(deviceId: string, referenceId: string, failedDevices: string[]): boolean {
		return failedDevices.includes(deviceId) || deviceId === referenceId;
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

	private async syncDeviceLimits(
		deviceId: string,
		documentId: string,
		limits: Record<string, number>,
	): Promise<void> {
		console.log(`🔄 Syncing device ${deviceId} with limits:`, limits);
		for (const [limitType, value] of Object.entries(limits)) {
			await this._updateDeviceLimitUseCase.execute({
				deviceDocumentId: documentId,
				limitType,
				value,
			});
		}
		console.log(`✅ Device ${deviceId} sync complete`);
	}

	private mapDtoToOutput(
		room: RoomQueryDto,
		limits: Record<string, number>,
		failedDevices: string[],
	): ShowRoomLimitsOutput {
		return {
			documentId: room.documentId,
			limits,
			failedDevices,
		};
	}
}
