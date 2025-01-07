import {
	OutputPort,
	RoomTypeQueryDto,
	RoomTypeQueryRepository,
	ShowRoomTypeByDocumentIdInput,
	ShowRoomTypeByDocumentIdOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { RoomTypeNotFoundError } from "EnviroSense/Infrastructure/Shared/mod.ts";

export class ShowRoomTypeByDocumentId implements UseCase<ShowRoomTypeByDocumentIdInput> {
	private readonly _outputPort: OutputPort<ShowRoomTypeByDocumentIdOutput>;
	private readonly _roomTypeRepository: RoomTypeQueryRepository;

	constructor(
		outputPort: OutputPort<ShowRoomTypeByDocumentIdOutput>,
		roomTypeRepository: RoomTypeQueryRepository,
	) {
		this._outputPort = outputPort;
		this._roomTypeRepository = roomTypeRepository;
	}

	public async execute(input: ShowRoomTypeByDocumentIdInput): Promise<void> {
		const RoomTypeQueryDto = (await this._roomTypeRepository.find(input.roomTypeDocumentId)).orElseThrow(() =>
			new RoomTypeNotFoundError(input.roomTypeDocumentId)
		);

		const roomType = this.mapDtoToOutput(RoomTypeQueryDto);
		this._outputPort.present(roomType);
	}

	private mapDtoToOutput(
		dto: RoomTypeQueryDto,
	): ShowRoomTypeByDocumentIdOutput {
		return {
			documentId: dto.documentId,
			name: dto.name,
			icon: dto.icon,
			rooms: dto.rooms,
		};
	}
}
