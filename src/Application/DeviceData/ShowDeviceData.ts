import {
    OutputPort,
    ShowDeviceDataInput,
    ShowDeviceDataOutput,
    DeviceDataQueryAllDto,
    DeviceDataQueryRepository,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowDeviceData implements UseCase<ShowDeviceDataInput> {
    private readonly _outputPort: OutputPort<ShowDeviceDataOutput[]>;
    private readonly _deviceDataQueryRepository: DeviceDataQueryRepository;

    constructor(
        outputPort: OutputPort<ShowDeviceDataOutput[]>,
        deviceDataQueryRepository: DeviceDataQueryRepository
    ) {
        this._outputPort = outputPort;
        this._deviceDataQueryRepository = deviceDataQueryRepository;
    }

    public async execute(input: ShowDeviceDataInput): Promise<void> {
        const deviceDataDto = await this._deviceDataQueryRepository.all(
            input.device
        );
        const deviceData = this.mapDtoToOutput(deviceDataDto);
        this._outputPort.present(deviceData);
    }

    private mapDtoToOutput(
        dto: DeviceDataQueryAllDto[]
    ): ShowDeviceDataOutput[] {
        return dto.map((item) => ({
            id: item.id,
            documentId: item.documentId,
            device: item.device,
            timestamp: item.timestamp,
            temperature: item.temperature,
            humidity: item.humidity,
            gas_ppm: item.gas_ppm,
        }));
    }
}
