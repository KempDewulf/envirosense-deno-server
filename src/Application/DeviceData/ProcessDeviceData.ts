import { DeviceDataRepository, DeviceRepository, ProcessDeviceDataInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceData } from "EnviroSense/Domain/mod.ts";
import { FirebaseMessaging } from "EnviroSense/Infrastructure/Messaging/FirebaseMessaging.ts";

export class ProcessDeviceData implements UseCase<ProcessDeviceDataInput> {
	private readonly _deviceRepository: DeviceRepository;
	private readonly _deviceDataRepository: DeviceDataRepository;
	private readonly _firebaseMessaging: FirebaseMessaging;

	constructor(
		deviceRepository: DeviceRepository,
		deviceDataRepository: DeviceDataRepository,
		firebaseMessaging: FirebaseMessaging,
	) {
		this._deviceRepository = deviceRepository;
		this._deviceDataRepository = deviceDataRepository;
		this._firebaseMessaging = firebaseMessaging;
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
			new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds())),
			input.airData,
		);

		await this._deviceDataRepository.save(deviceData);

		//TODO: make it not hardcoded: device!.room!.building!.documentId
		await this._firebaseMessaging.sendToTopic(
            "buildings-gox5y6bsrg640qb11ak44dh0",
            "Building Alert",
            `New reading from ${device.identifier}: Temperature: ${input.airData.temperature}°C, Humidity: ${input.airData.humidity}%`
        );
	}
}
