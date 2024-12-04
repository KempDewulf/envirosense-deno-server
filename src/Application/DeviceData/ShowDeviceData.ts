import {
    OutputPort,
    ShowDeviceDatasInput,
    ShowDeviceDatasOutput,
    DeviceDataQueryAllDto,
    DeviceDataQueryRepository,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowDeviceDatas implements UseCase<ShowDeviceDatasInput> {
    private readonly _outputPort: OutputPort<ShowDeviceDatasOutput[]>;
    private readonly _deviceDataQueryRepository: DeviceDataQueryRepository;

    constructor(
        outputPort: OutputPort<ShowDeviceDatasOutput[]>,
        deviceDataQueryRepository: DeviceDataQueryRepository
    ) {
        this._outputPort = outputPort;
        this._deviceDataQueryRepository = deviceDataQueryRepository;
    }

    public async execute(input: ShowDeviceDatasInput): Promise<void> {
        const deviceDataDto = await this._deviceDataQueryRepository.all(
            input.name
        );
        const deviceData = this.mapDtoToOutput(deviceDataDto);
        this._outputPort.present(deviceData);
    }

    private mapDtoToOutput(
        dto: DeviceDataQueryAllDto[]
    ): ShowDeviceDatasOutput[] {
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
