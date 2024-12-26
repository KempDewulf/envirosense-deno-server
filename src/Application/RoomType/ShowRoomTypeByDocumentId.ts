import {
	OutputPort,
	RoomTypeQueryDto,
	RoomTypeQueryRepository,
	ShowRoomTypeByDocumentIdInput,
	ShowRoomTypeByDocumentIdOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

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
		const roomTypeOptional = await this._roomTypeRepository.find(
			input.roomTypeDocumentId,
		);

		const roomTypeDto = roomTypeOptional.orElseThrow(
			() =>
				new Error(
					`RoomType with ID ${input.roomTypeDocumentId} not found.`,
				),
		);

		const roomType = this.mapDtoToOutput(roomTypeDto);
		this._outputPort.present(roomType);
	}

	private mapDtoToOutput(
		dto: RoomTypeQueryDto,
	): ShowRoomTypeByDocumentIdOutput {
		return {
			documentId: dto.documentId,
			documentId: dto.documentId,
			name: dto.name,
			icon: dto.icon,
			rooms: dto.rooms,
		};
	}
}
