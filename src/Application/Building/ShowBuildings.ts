import {
    OutputPort,
    ShowBuildingsInput,
    ShowBuildingsOutput,
    BuildingQueryAllDto,
    BuildingQueryRepository,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowBuildings implements UseCase<ShowBuildingsInput> {
    private readonly _outputPort: OutputPort<ShowBuildingsOutput[]>;
    private readonly _buildingQueryRepository: BuildingQueryRepository;

    constructor(
        outputPort: OutputPort<ShowBuildingsOutput[]>,
        buildingQueryRepository: BuildingQueryRepository
    ) {
        this._outputPort = outputPort;
        this._buildingQueryRepository = buildingQueryRepository;
    }

    public async execute(input: ShowBuildingsInput): Promise<void> {
        const buildingsDto = await this._buildingQueryRepository.all(input.name);
        const buildings = this.mapDtoToOutput(buildingsDto);
        this._outputPort.present(buildings);
    }

    private mapDtoToOutput(dto: BuildingQueryAllDto[]): ShowBuildingsOutput[] {
        return dto.map((item) => ({
            id: item.id,
            documentId: item.documentId,
            name: item.name,
            address: item.address,
            rooms: item.rooms,
        }));
    }
}
