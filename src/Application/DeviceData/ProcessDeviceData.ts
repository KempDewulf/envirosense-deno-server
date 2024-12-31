import { DeviceDataRepository, DeviceRepository, ProcessDeviceDataInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceData } from "EnviroSense/Domain/mod.ts";

export class ProcessDeviceData implements UseCase<ProcessDeviceDataInput> {
	private readonly _deviceRepository: DeviceRepository;
	private readonly _deviceDataRepository: DeviceDataRepository;

	constructor(
		deviceRepository: DeviceRepository,
		deviceDataRepository: DeviceDataRepository,
	) {
		this._deviceRepository = deviceRepository;
		this._deviceDataRepository = deviceDataRepository;
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
	}
}
