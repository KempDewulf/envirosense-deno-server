import {
	OutputPort,
	RoomQueryDto,
	RoomQueryRepository,
	ShowRoomByDocumentIdInput,
	ShowRoomByDocumentIdOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { RoomNotFoundError } from "EnviroSense/Infrastructure/Shared/Errors/RoomNotFoundError.ts";

export class ShowRoomByDocumentId implements UseCase<ShowRoomByDocumentIdInput> {
	private readonly _outputPort: OutputPort<ShowRoomByDocumentIdOutput>;
	private readonly _roomRepository: RoomQueryRepository;

	constructor(
		outputPort: OutputPort<ShowRoomByDocumentIdOutput>,
		roomRepository: RoomQueryRepository,
	) {
		this._outputPort = outputPort;
		this._roomRepository = roomRepository;
	}

	public async execute(input: ShowRoomByDocumentIdInput): Promise<void> {
		const roomQueryDto = (await this._roomRepository.find(input.roomDocumentId)).orElseThrow(() =>
			new RoomNotFoundError(input.roomDocumentId)
		);

		const room = this.mapDtoToOutput(roomQueryDto);
		this._outputPort.present(room);
	}

	private mapDtoToOutput(dto: RoomQueryDto): ShowRoomByDocumentIdOutput {
		return {
			documentId: dto.documentId,
			name: dto.name,
			building: dto.building,
			roomType: dto.roomType,
			devices: dto.devices,
		};
	}
}
