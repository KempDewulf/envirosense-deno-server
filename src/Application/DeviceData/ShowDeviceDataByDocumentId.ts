import {
	DeviceDataQueryDto,
	DeviceDataQueryRepository,
	OutputPort,
	ShowDeviceDataByDocumentIdInput,
	ShowDeviceDataByDocumentIdOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowDeviceDataByDocumentId implements UseCase<ShowDeviceDataByDocumentIdInput> {
	private readonly _outputPort: OutputPort<ShowDeviceDataByDocumentIdOutput>;
	private readonly _deviceDataRepository: DeviceDataQueryRepository;

	constructor(
		outputPort: OutputPort<ShowDeviceDataByDocumentIdOutput>,
		deviceDataRepository: DeviceDataQueryRepository,
	) {
		this._outputPort = outputPort;
		this._deviceDataRepository = deviceDataRepository;
	}

	public async execute(input: ShowDeviceDataByDocumentIdInput): Promise<void> {
		const deviceDataOptional = await this._deviceDataRepository.find(
			input.deviceDataDocumentId,
		);

		const deviceDataDto = deviceDataOptional.orElseThrow(() =>
			new Error(`DeviceData with ID ${input.deviceDataDocumentId} not found.`)
		);

		const deviceData = this.mapDtoToOutput(deviceDataDto);
		this._outputPort.present(deviceData);
	}

	private mapDtoToOutput(
		dto: DeviceDataQueryDto,
	): ShowDeviceDataByDocumentIdOutput {
		return {
			id: dto.id,
			documentId: dto.documentId,
			device: dto.device,
			timestamp: dto.timestamp,
			airData: dto.airData,
		};
	}
}
