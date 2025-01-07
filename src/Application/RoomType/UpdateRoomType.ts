import {
	OutputPort,
	RoomTypeRepository,
	UpdateRoomTypeInput,
	UpdateRoomTypeOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { RoomTypeNotFoundError } from "EnviroSense/Infrastructure/Shared/mod.ts";

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
		const roomType = (await this._roomTypeRepository.find(input.roomTypeDocumentId)).orElseThrow(() =>
			new RoomTypeNotFoundError(input.roomTypeDocumentId)
		);

		if (input.name !== undefined) {
			roomType.updateName(input.name);
		}

		if (input.icon !== undefined) {
			roomType.updateIcon(input.icon);
		}

		await this._roomTypeRepository.update(roomType);

		const output: UpdateRoomTypeOutput = {
			documentId: roomType.documentId,
			name: roomType.name,
			icon: roomType.icon,
		};

		this._outputPort.present(output);
	}
}
