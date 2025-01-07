import {
	DeviceDataQueryDto,
	DeviceDataQueryRepository,
	OutputPort,
	ShowDeviceDataByDocumentIdInput,
	ShowDeviceDataByDocumentIdOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceDataNotFoundError } from "EnviroSense/Infrastructure/Shared/mod.ts";

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

	public async execute(
		input: ShowDeviceDataByDocumentIdInput,
	): Promise<void> {
		const deviceDataQueryDto = (await this._deviceDataRepository.find(input.deviceDataDocumentId)).orElseThrow(() =>
			new DeviceDataNotFoundError(input.deviceDataDocumentId)
		);

		const deviceData = this.mapDtoToOutput(deviceDataQueryDto);
		this._outputPort.present(deviceData);
	}

	private mapDtoToOutput(
		dto: DeviceDataQueryDto,
	): ShowDeviceDataByDocumentIdOutput {
		return {
			documentId: dto.documentId,
			device: dto.device,
			timestamp: dto.timestamp,
			airData: dto.airData,
		};
	}
}
