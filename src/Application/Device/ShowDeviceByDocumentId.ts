import {
	DeviceQueryDto,
	DeviceQueryRepository,
	OutputPort,
	ShowDeviceByDocumentIdInput,
	ShowDeviceByDocumentIdOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceNotFoundError } from "EnviroSense/Infrastructure/Shared/mod.ts";

export class ShowDeviceByDocumentId implements UseCase<ShowDeviceByDocumentIdInput> {
	private readonly _outputPort: OutputPort<ShowDeviceByDocumentIdOutput>;
	private readonly _deviceRepository: DeviceQueryRepository;

	constructor(
		outputPort: OutputPort<ShowDeviceByDocumentIdOutput>,
		deviceRepository: DeviceQueryRepository,
	) {
		this._outputPort = outputPort;
		this._deviceRepository = deviceRepository;
	}

	public async execute(input: ShowDeviceByDocumentIdInput): Promise<void> {
		const deviceQueryDto = (await this._deviceRepository.find(input.deviceDocumentId)).orElseThrow(() =>
			new DeviceNotFoundError(input.deviceDocumentId)
		);

		const device = this.mapDtoToOutput(deviceQueryDto);
		this._outputPort.present(device);
	}

	private mapDtoToOutput(dto: DeviceQueryDto): ShowDeviceByDocumentIdOutput {
		return {
			documentId: dto.documentId,
			identifier: dto.identifier,
			room: dto.room,
		};
	}
}
