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
		const buildingOptional = await this._buildingRepository.find(
			input.buildingDocumentId,
		);

		const buildingDto = buildingOptional.orElseThrow(
			() =>
				new Error(
					`Building with ID ${input.buildingDocumentId} not found.`,
				),
		);

		const buildingEntity = Building.load(buildingDto);

		const { enviroScore, roomScores } = await this._airQualityCalculator.calculateBuildingMetrics(
			buildingEntity,
		);

		const airQuality = this.mapDataToOutput(
			buildingDto,
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
