import {
	BuildingQueryDto,
	BuildingQueryRepository,
	OutputPort,
	ShowBuildingByDocumentIdInput,
	ShowBuildingByDocumentIdOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { BuildingNotFoundError } from "EnviroSense/Infrastructure/Shared/Errors/BuildingNotFoundError.ts";

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
		const buildingQueryDto = (await this._buildingRepository.find(
			input.buildingDocumentId,
		)).orElseThrow(() => new BuildingNotFoundError(input.buildingDocumentId));

		const building = this.mapDtoToOutput(buildingQueryDto);
		this._outputPort.present(building);
	}

	private mapDtoToOutput(
		dto: BuildingQueryDto,
	): ShowBuildingByDocumentIdOutput {
		return {
			documentId: dto.documentId,
			name: dto.name,
			address: dto.address,
			rooms: dto.rooms,
		};
	}
}
