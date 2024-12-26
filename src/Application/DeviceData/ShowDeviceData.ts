import {
	DeviceDataQueryDto,
	DeviceDataQueryRepository,
	OutputPort,
	ShowDeviceDataInput,
	ShowDeviceDataOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowDeviceData implements UseCase<ShowDeviceDataInput> {
	private readonly _outputPort: OutputPort<ShowDeviceDataOutput[]>;
	private readonly _deviceDataQueryRepository: DeviceDataQueryRepository;

	constructor(
		outputPort: OutputPort<ShowDeviceDataOutput[]>,
		deviceDataQueryRepository: DeviceDataQueryRepository,
	) {
		this._outputPort = outputPort;
		this._deviceDataQueryRepository = deviceDataQueryRepository;
	}

	public async execute(input: ShowDeviceDataInput): Promise<void> {
		const deviceDataDto = await this._deviceDataQueryRepository.all(
			input.identifier,
		);

		const deviceData = this.mapDtoToOutput(deviceDataDto);

		this._outputPort.present(deviceData);
	}

	private mapDtoToOutput(dto: DeviceDataQueryDto[]): ShowDeviceDataOutput[] {
		return dto.map((item) => ({
			documentId: item.documentId,
			device: item.device,
			timestamp: item.timestamp,
			airData: item.airData,
		}));
	}
}
