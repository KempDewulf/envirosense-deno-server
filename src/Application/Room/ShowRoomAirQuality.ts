import {
	OutputPort,
	RoomQueryDto,
	RoomQueryRepository,
	ShowRoomAirQualityInput,
	ShowRoomAirQualityOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { AirData, Room } from "EnviroSense/Domain/mod.ts";
import { AirQualityCalculator } from "EnviroSense/Infrastructure/Services/AirQualityCalculator.ts";

export class ShowRoomAirQuality implements UseCase<ShowRoomAirQualityInput> {
	private readonly _outputPort: OutputPort<ShowRoomAirQualityOutput>;
	private readonly _roomRepository: RoomQueryRepository;
	private readonly _airQualityCalculator: AirQualityCalculator;

	constructor(
		outputPort: OutputPort<ShowRoomAirQualityOutput>,
		roomRepository: RoomQueryRepository,
		_airQualityCalculator: AirQualityCalculator,
	) {
		this._outputPort = outputPort;
		this._roomRepository = roomRepository;
		this._airQualityCalculator = _airQualityCalculator;
	}

	public async execute(input: ShowRoomAirQualityInput): Promise<void> {
		const roomOptional = await this._roomRepository.find(
			input.roomDocumentId,
		);

		const roomDto = roomOptional.orElseThrow(() => new Error(`Room with ID ${input.roomDocumentId} not found.`));

		const roomEntity = Room.load(roomDto);

		const enviroScore = await this._airQualityCalculator
			.calculateEnviroScore(roomEntity);

		const averagedAirQuality = await this._airQualityCalculator
			.calculateAverageAirQuality(roomEntity);

		const airQuality = this.mapDataToOutput(
			roomDto,
			enviroScore,
			averagedAirQuality,
		);
		this._outputPort.present(airQuality);
	}

	private mapDataToOutput(
		dto: RoomQueryDto,
		enviroScore: number,
		averagedAirQuality: AirData,
	): ShowRoomAirQualityOutput {
		return {
			id: dto.documentId,
			enviroScore: enviroScore,
			airQuality: averagedAirQuality,
		};
	}
}
