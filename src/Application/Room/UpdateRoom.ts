import { OutputPort, RoomRepository, UpdateRoomInput, UpdateRoomOutput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { RoomNotFoundError } from "EnviroSense/Infrastructure/Shared/mod.ts";

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
		const room = (await this._roomRepository.find(input.roomDocumentId)).orElseThrow(() => new RoomNotFoundError(input.roomDocumentId));

		if (input.name !== undefined) {
			room.updateName(input.name);
		}

		await this._roomRepository.update(room);

		const output: UpdateRoomOutput = {
			documentId: room.documentId,
			name: room.name,
		};

		this._outputPort.present(output);
	}
}
