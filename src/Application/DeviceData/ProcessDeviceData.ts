import { DeviceDataRepository, DeviceRepository, ProcessDeviceDataInput, RoomRepository, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { Device, DeviceData } from "EnviroSense/Domain/mod.ts";
import { FirebaseMessaging } from "EnviroSense/Infrastructure/Messaging/FirebaseMessaging.ts";
import { AirQualityCalculator } from "EnviroSense/Infrastructure/Services/AirQualityCalculator.ts";
import { RoomStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";

export class ProcessDeviceData implements UseCase<ProcessDeviceDataInput> {
	private readonly _deviceRepository: DeviceRepository;
	private readonly _deviceDataRepository: DeviceDataRepository;
	private readonly _roomRepository: RoomRepository;
	private readonly _firebaseMessaging: FirebaseMessaging;
	private readonly _airQualityCalculator: AirQualityCalculator;

	constructor(
		deviceRepository: DeviceRepository,
		deviceDataRepository: DeviceDataRepository,
		firebaseMessaging: FirebaseMessaging,
	) {
		this._deviceRepository = deviceRepository;
		this._deviceDataRepository = deviceDataRepository;
		this._firebaseMessaging = firebaseMessaging;
		this._airQualityCalculator = new AirQualityCalculator(this._deviceRepository, this._deviceDataRepository);
		this._roomRepository = new RoomStrapiRepository();
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

		const enviroScore: number = await this._airQualityCalculator.computeEnviroScore(deviceData);
		if (enviroScore < 50) this.sendNotification(device, input, enviroScore);
	}

	private async sendNotification(device: Device, input: ProcessDeviceDataInput, enviroScore: number): Promise<void> {
		const buildingDocumentId = (await this._roomRepository.find(device.room?.documentId!)).value.building?.documentId;

		await this._firebaseMessaging.sendToTopic(
			"buildings-" + buildingDocumentId,
			"Building Alert",
			`New reading from ${device.identifier}: Temperature: ${input.airData.temperature}°C, Humidity: ${input.airData.humidity}%, Air Quality: ${enviroScore}%`,
		);
	}
}
