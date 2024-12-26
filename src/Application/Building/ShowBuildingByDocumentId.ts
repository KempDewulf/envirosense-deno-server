import {
	BuildingQueryDto,
	BuildingQueryRepository,
	OutputPort,
	ShowBuildingByDocumentIdInput,
	ShowBuildingByDocumentIdOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowBuildingByDocumentId implements UseCase<ShowBuildingByDocumentIdInput> {
	private readonly _outputPort: OutputPort<ShowBuildingByDocumentIdOutput>;
	private readonly _buildingRepository: BuildingQueryRepository;

	constructor(
		outputPort: OutputPort<ShowBuildingByDocumentIdOutput>,
		buildingRepository: BuildingQueryRepository,
	) {
		this._outputPort = outputPort;
		this._buildingRepository = buildingRepository;
	}

	public async execute(input: ShowBuildingByDocumentIdInput): Promise<void> {
		const buildingOptional = await this._buildingRepository.find(
			input.buildingDocumentId,
		);

		const buildingDto = buildingOptional.orElseThrow(
			() =>
				new Error(
					`Building with ID ${input.buildingDocumentId} not found.`,
				),
		);

		const building = this.mapDtoToOutput(buildingDto);
		this._outputPort.present(building);
	}

	private mapDtoToOutput(
		dto: BuildingQueryDto,
	): ShowBuildingByDocumentIdOutput {
		return {
			documentId: dto.documentId,
			documentId: dto.documentId,
			name: dto.name,
			address: dto.address,
			rooms: dto.rooms,
		};
	}
}
