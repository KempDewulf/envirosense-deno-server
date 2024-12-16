import {
    OutputPort,
    UseCase,
    ShowDeviceByDocumentIdInput,
    ShowDeviceByDocumentIdOutput,
    DeviceQueryDto,
    DeviceQueryRepository,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowDeviceByDocumentId
    implements UseCase<ShowDeviceByDocumentIdInput>
{
    private readonly _outputPort: OutputPort<ShowDeviceByDocumentIdOutput>;
    private readonly _deviceRepository: DeviceQueryRepository;

    constructor(
        outputPort: OutputPort<ShowDeviceByDocumentIdOutput>,
        deviceRepository: DeviceQueryRepository
    ) {
        this._outputPort = outputPort;
        this._deviceRepository = deviceRepository;
    }

    public async execute(input: ShowDeviceByDocumentIdInput): Promise<void> {
        const deviceOptional = await this._deviceRepository.find(
            input.deviceDocumentId
        );

        const deviceDto = deviceOptional.orElseThrow(() =>
            new Error(`Device with ID ${input.deviceDocumentId} not found.`)
        );

        const device = this.mapDtoToOutput(deviceDto);
        this._outputPort.present(device);
    }

    private mapDtoToOutput(
        dto: DeviceQueryDto
    ): ShowDeviceByDocumentIdOutput {
        return {
            id: dto.id,
            documentId: dto.documentId,
            identifier: dto.identifier,
            room: dto.room,
            device_data: dto.device_data
        };
    }
}
