import {
	DeviceDataRepository,
	DeviceRepository,
	ProcessDeviceDataInput,
	RoomRepository,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { AirData, Device, DeviceData } from "EnviroSense/Domain/mod.ts";
import { AirQualityCalculator } from "EnviroSense/Infrastructure/Services/AirQualityCalculator.ts";
import { NotificationService } from "EnviroSense/Infrastructure/Services/NotificationService.ts";
import { FirebaseMessaging } from "EnviroSense/Infrastructure/Messaging/FirebaseMessaging.ts";
import { DeviceDataStrapiQueryRepository, DeviceStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { DeviceNotFoundError } from "EnviroSense/Infrastructure/Shared/Errors/DeviceNotFoundError.ts";

export class ProcessDeviceData implements UseCase<ProcessDeviceDataInput> {
	private readonly _deviceRepository: DeviceRepository;
	private readonly _deviceDataRepository: DeviceDataRepository;
	private readonly _airQualityCalculator: AirQualityCalculator;
	private readonly _notificationService: NotificationService;

	constructor(
		deviceRepository: DeviceRepository,
		deviceDataRepository: DeviceDataRepository,
		firebaseMessaging: FirebaseMessaging,
		roomRepository: RoomRepository,
	) {
		this._deviceRepository = deviceRepository;
		this._deviceDataRepository = deviceDataRepository;
		const deviceQueryRepository = new DeviceStrapiQueryRepository();
		const deviceDataQueryRepository = new DeviceDataStrapiQueryRepository();
		this._airQualityCalculator = new AirQualityCalculator(deviceQueryRepository, deviceDataQueryRepository);
		this._notificationService = new NotificationService(firebaseMessaging, roomRepository);
	}

	public async execute(input: ProcessDeviceDataInput): Promise<void> {
		const device = (await this._deviceRepository.findByIdentifier(input.deviceIdentifier)).orElseThrow(() =>
			new DeviceNotFoundError(input.deviceIdentifier)
		);

		const deviceData = this.createDeviceData(device, input.airData);

		await this._deviceDataRepository.save(deviceData);

		const enviroScore = await this._airQualityCalculator.computeEnviroScore(deviceData);
		if (enviroScore < 70) this._notificationService.sendAirQualityNotification(device, input, enviroScore);
	}

	private createDeviceData(device: Device, airData: AirData): DeviceData {
		return DeviceData.create(
			"",
			device,
			this.createUtcDate(),
			airData,
		);
	}

	private createUtcDate(): Date {
		const date = new Date();
		return new Date(Date.UTC(
			date.getUTCFullYear(),
			date.getUTCMonth(),
			date.getUTCDate(),
			date.getUTCHours(),
			date.getUTCMinutes(),
			date.getUTCSeconds(),
			date.getUTCMilliseconds(),
		));
	}
}
