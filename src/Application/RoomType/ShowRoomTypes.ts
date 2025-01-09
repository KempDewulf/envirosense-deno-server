import {
	OutputPort,
	RoomTypeQueryDto,
	RoomTypeQueryRepository,
	ShowRoomTypesInput,
	ShowRoomTypesOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowRoomTypes implements UseCase<ShowRoomTypesInput> {
	private readonly _outputPort: OutputPort<ShowRoomTypesOutput[]>;
	private readonly _roomTypeQueryRepository: RoomTypeQueryRepository;

	constructor(
		outputPort: OutputPort<ShowRoomTypesOutput[]>,
		roomTypeQueryRepository: RoomTypeQueryRepository,
	) {
		this._outputPort = outputPort;
		this._roomTypeQueryRepository = roomTypeQueryRepository;
	}

	public async execute(input: ShowRoomTypesInput): Promise<void> {
		const roomTypesQueryDto = await this._roomTypeQueryRepository.all(
			input.name,
		);
		const output = this.mapDtoToOutput(roomTypesQueryDto);
		this._outputPort.present(output);
	}

	private mapDtoToOutput(dto: RoomTypeQueryDto[]): ShowRoomTypesOutput[] {
		return dto.map((item) => ({
			documentId: item.documentId,
			name: item.name,
			icon: item.icon,
			rooms: item.rooms,
		}));
	}
}
