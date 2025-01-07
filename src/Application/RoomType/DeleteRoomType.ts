import { DeleteRoomTypeInput, RoomTypeRepository, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { RoomTypeNotFoundError } from "EnviroSense/Infrastructure/Shared/mod.ts";

export class DeleteRoomType implements UseCase<DeleteRoomTypeInput> {
	private readonly _roomTypeRepository: RoomTypeRepository;

	constructor(
		roomTypeRepository: RoomTypeRepository,
	) {
		this._roomTypeRepository = roomTypeRepository;
	}

	public async execute(input: DeleteRoomTypeInput): Promise<void> {
		const roomType = (await this._roomTypeRepository.find(input.roomTypeDocumentId)).orElseThrow(() =>
			new RoomTypeNotFoundError(input.roomTypeDocumentId)
		);

		await this._roomTypeRepository.deleteEntity(roomType);
	}
}
