import {
	BuildingQueryDto,
	BuildingQueryRepository,
	OutputPort,
	RoomAirQualityOutput,
	ShowBuildingAirQualityInput,
	ShowBuildingAirQualityOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { Building } from "EnviroSense/Domain/mod.ts";
import { AirQualityCalculator } from "EnviroSense/Infrastructure/Services/AirQualityCalculator.ts";
import { BuildingNotFoundError } from "EnviroSense/Infrastructure/Shared/Errors/BuildingNotFoundError.ts";

export class ShowBuildingAirQuality implements UseCase<ShowBuildingAirQualityInput> {
	private readonly _outputPort: OutputPort<ShowBuildingAirQualityOutput>;
	private readonly _buildingRepository: BuildingQueryRepository;
	private readonly _airQualityCalculator: AirQualityCalculator;

	constructor(
		outputPort: OutputPort<ShowBuildingAirQualityOutput>,
		buildingRepository: BuildingQueryRepository,
		_airQualityCalculator: AirQualityCalculator,
	) {
		this._outputPort = outputPort;
		this._buildingRepository = buildingRepository;
		this._airQualityCalculator = _airQualityCalculator;
	}

	public async execute(input: ShowBuildingAirQualityInput): Promise<void> {
		const buildingQueryDto = (await this._buildingRepository.find(input.buildingDocumentId)).orElseThrow(() =>
			new BuildingNotFoundError(input.buildingDocumentId)
		);

		const building = Building.load(buildingQueryDto);

		const { enviroScore, roomScores } = await this._airQualityCalculator.calculateBuildingMetrics(
			building,
		);

		const airQuality = this.mapDataToOutput(
			building,
			enviroScore,
			roomScores,
		);

		this._outputPort.present(airQuality);
	}

	private mapDataToOutput(
		dto: BuildingQueryDto,
		enviroScore: number | null,
		roomScores: RoomAirQualityOutput[],
	): ShowBuildingAirQualityOutput {
		return {
			documentId: dto.documentId,
			enviroScore: enviroScore,
			rooms: roomScores,
		};
	}
}
