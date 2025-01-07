import { BuildingRepository, DeleteBuildingInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { BuildingNotFoundError } from "EnviroSense/Infrastructure/Shared/mod.ts";

export class DeleteBuilding implements UseCase<DeleteBuildingInput> {
	private readonly _buildingRepository: BuildingRepository;

	constructor(
		buildingRepository: BuildingRepository,
	) {
		this._buildingRepository = buildingRepository;
	}

	public async execute(input: DeleteBuildingInput): Promise<void> {
		const building = (await this._buildingRepository.find(input.buildingDocumentId))
			.orElseThrow(() => new BuildingNotFoundError(input.buildingDocumentId));

		await this._buildingRepository.deleteEntity(building);
	}
}
