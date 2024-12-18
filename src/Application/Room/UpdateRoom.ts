import { OutputPort, RoomRepository, UpdateRoomInput, UpdateRoomOutput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export class UpdateRoom implements UseCase<UpdateRoomInput> {
	private readonly _outputPort: OutputPort<UpdateRoomOutput>;
	private readonly _roomRepository: RoomRepository;

	constructor(
		outputPort: OutputPort<UpdateRoomOutput>,
		roomRepository: RoomRepository,
	) {
		this._outputPort = outputPort;
		this._roomRepository = roomRepository;
	}

	public async execute(input: UpdateRoomInput): Promise<void> {
		const roomOptional = await this._roomRepository.find(
			input.roomDocumentId,
		);
		const room = roomOptional.orElseThrow(
			() => new Error(`Room with ID ${input.roomDocumentId} not found.`),
		);

		if (input.name !== undefined) {
			room.updateName(input.name);
		}

		await this._roomRepository.update(room);

		const output: UpdateRoomOutput = {
			id: room.id,
			documentId: room.id,
			name: room.name,
		};

		this._outputPort.present(output);
	}
}
