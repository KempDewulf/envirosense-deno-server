import {
	DeviceQueryDto,
	DeviceQueryRepository,
	OutputPort,
	ShowDevicesInput,
	ShowDevicesOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowDevices implements UseCase<ShowDevicesInput> {
	private readonly _outputPort: OutputPort<ShowDevicesOutput[]>;
	private readonly _deviceQueryRepository: DeviceQueryRepository;

	constructor(
		outputPort: OutputPort<ShowDevicesOutput[]>,
		deviceQueryRepository: DeviceQueryRepository,
	) {
		this._outputPort = outputPort;
		this._deviceQueryRepository = deviceQueryRepository;
	}

	public async execute(input: ShowDevicesInput): Promise<void> {
		const devicesQueryDto = await this._deviceQueryRepository.all(input.identifier);
		const devices = this.mapDtoToOutput(devicesQueryDto);
		this._outputPort.present(devices);
	}

	private mapDtoToOutput(dto: DeviceQueryDto[]): ShowDevicesOutput[] {
		return dto.map((item) => ({
			documentId: item.documentId,
			identifier: item.identifier,
			room: item.room,
		}));
	}
}
