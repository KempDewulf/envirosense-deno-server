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
import { RoomNotFoundError } from "EnviroSense/Infrastructure/Shared/Errors/RoomNotFoundError.ts";

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
		const roomQueryDto = (await this._roomRepository.find(input.roomDocumentId)).orElseThrow(() =>
			new RoomNotFoundError(input.roomDocumentId)
		);

		const roomEntity = Room.load(roomQueryDto);

		const { airData: averagedAirQuality, enviroScore } = await this._airQualityCalculator.calculateMetrics(roomEntity);

		const airQuality = this.mapDataToOutput(
			roomQueryDto,
			enviroScore,
			averagedAirQuality,
		);
		this._outputPort.present(airQuality);
	}

	private mapDataToOutput(
		dto: RoomQueryDto,
		enviroScore: number | null,
		averagedAirQuality: AirData,
	): ShowRoomAirQualityOutput {
		return {
			documentId: dto.documentId,
			enviroScore: enviroScore,
			airQuality: averagedAirQuality,
		};
	}
}
