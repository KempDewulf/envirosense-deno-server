import {
	DeviceDataRepository,
	DeviceRepository,
	ProcessDeviceDataInput,
	RoomRepository,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceData } from "EnviroSense/Domain/mod.ts";
import { AirQualityCalculator } from "EnviroSense/Infrastructure/Services/AirQualityCalculator.ts";
import { NotificationService } from "EnviroSense/Infrastructure/Services/NotificationService.ts";
import { FirebaseMessaging } from "EnviroSense/Infrastructure/Messaging/FirebaseMessaging.ts";

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
		this._airQualityCalculator = new AirQualityCalculator(this._deviceRepository, this._deviceDataRepository);
		this._notificationService = new NotificationService(firebaseMessaging, roomRepository);
	}

	public async execute(input: ProcessDeviceDataInput): Promise<void> {
		const optionalDevice = await this._deviceRepository.findByIdentifier(
			input.deviceIdentifier,
		);
		if (!optionalDevice.isPresent) {
			console.error(
				`Device with identifier ${input.deviceIdentifier} not found.`,
			);
			return;
		}

		const device = optionalDevice.value;
		const date = new Date();

		const deviceData = DeviceData.create(
			"",
			device,
			new Date(
				Date.UTC(
					date.getUTCFullYear(),
					date.getUTCMonth(),
					date.getUTCDate(),
					date.getUTCHours(),
					date.getUTCMinutes(),
					date.getUTCSeconds(),
					date.getUTCMilliseconds(),
				),
			),
			input.airData,
		);

		await this._deviceDataRepository.save(deviceData);

		const enviroScore = await this._airQualityCalculator.computeEnviroScore(deviceData);
		if (enviroScore < 70) this._notificationService.sendAirQualityNotification(device, input, enviroScore);
	}
}
