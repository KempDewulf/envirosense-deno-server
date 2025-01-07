import {
	BuildingRepository,
	OutputPort,
	UpdateBuildingInput,
	UpdateBuildingOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { BuildingNotFoundError } from "EnviroSense/Infrastructure/Shared/Errors/BuildingNotFoundError.ts";

export class UpdateBuilding implements UseCase<UpdateBuildingInput> {
	private readonly _outputPort: OutputPort<UpdateBuildingOutput>;
	private readonly _buildingRepository: BuildingRepository;

	constructor(
		outputPort: OutputPort<UpdateBuildingOutput>,
		buildingRepository: BuildingRepository,
	) {
		this._outputPort = outputPort;
		this._buildingRepository = buildingRepository;
	}

	public async execute(input: UpdateBuildingInput): Promise<void> {
		const building = (await this._buildingRepository.find(input.buildingDocumentId)).orElseThrow(() =>
			new BuildingNotFoundError(input.buildingDocumentId)
		);

		if (input.name !== undefined) {
			building.updateName(input.name);
		}

		if (input.address !== undefined) {
			building.updateAddress(input.address);
		}

		await this._buildingRepository.update(building);

		const output: UpdateBuildingOutput = {
			documentId: building.documentId,
			name: building.name,
			address: building.address,
		};

		this._outputPort.present(output);
	}
}
