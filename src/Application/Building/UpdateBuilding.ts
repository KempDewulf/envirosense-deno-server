import {
	BuildingRepository,
	OutputPort,
	UpdateBuildingInput,
	UpdateBuildingOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

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
		const buildingOptional = await this._buildingRepository.find(
			input.buildingDocumentId,
		);
		const building = buildingOptional.orElseThrow(
			() =>
				new Error(
					`Building with ID ${input.buildingDocumentId} not found.`,
				),
		);

		if (input.name !== undefined) {
			building.updateName(input.name);
		}

		if (input.address !== undefined) {
			building.updateAddress(input.address);
		}

		await this._buildingRepository.update(building);

		const output: UpdateBuildingOutput = {
			id: building.id,
			name: building.name,
			address: building.address,
		};

		this._outputPort.present(output);
	}
}
