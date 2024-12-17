import {
	OutputPort,
	RoomTypeRepository,
	UpdateRoomTypeInput,
	UpdateRoomTypeOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class UpdateRoomType implements UseCase<UpdateRoomTypeInput> {
	private readonly _outputPort: OutputPort<UpdateRoomTypeOutput>;
	private readonly _roomTypeRepository: RoomTypeRepository;

	constructor(
		outputPort: OutputPort<UpdateRoomTypeOutput>,
		roomTypeRepository: RoomTypeRepository,
	) {
		this._outputPort = outputPort;
		this._roomTypeRepository = roomTypeRepository;
	}

	public async execute(input: UpdateRoomTypeInput): Promise<void> {
		const roomTypeOptional = await this._roomTypeRepository.find(input.roomTypeDocumentId);
		const roomType = roomTypeOptional.orElseThrow(() =>
			new Error(`RoomType with ID ${input.roomTypeDocumentId} not found.`)
		);

		if (input.name !== undefined) {
			roomType.updateName(input.name);
		}

		if (input.icon !== undefined) {
			roomType.updateIcon(input.icon);
		}

		await this._roomTypeRepository.update(roomType);

		const output: UpdateRoomTypeOutput = {
			id: roomType.id,
			documentId: roomType.id,
			name: roomType.name,
			icon: roomType.icon,
		};

		this._outputPort.present(output);
	}
}
