import { Building } from "EnviroSense/Domain/mod.ts";
import {
    BuildingRepository,
    CreateBuildingInput,
    CreateBuildingOutput,
    OutputPort,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class CreateBuilding implements UseCase<CreateBuildingInput> {
    private readonly _outputPort: OutputPort<CreateBuildingOutput>;
    private readonly _buildingRepository: BuildingRepository;

    constructor(
        outputPort: OutputPort<CreateBuildingOutput>,
        buildingRepository: BuildingRepository
    ) {
        this._outputPort = outputPort;
        this._buildingRepository = buildingRepository;
    }

    public async execute(input: CreateBuildingInput): Promise<void> {
        const building = Building.create("", input.name, input.address);

        await this._buildingRepository.save(building);
        this._outputPort.present({
            documentId: building.documentId.toString(),
        });
    }
}
