import { Room } from "EnviroSense/Domain/mod.ts";
import {
	BuildingRepository,
	CreateRoomInput,
	CreateRoomOutput,
	OutputPort,
	RoomRepository,
	RoomTypeRepository,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { BuildingNotFoundError } from "EnviroSense/Infrastructure/Shared/Errors/BuildingNotFoundError.ts";
import { RoomTypeNotFoundError } from "EnviroSense/Infrastructure/Shared/Errors/RoomTypeNotFoundError.ts";

export class CreateRoom implements UseCase<CreateRoomInput> {
	private readonly _outputPort: OutputPort<CreateRoomOutput>;
	private readonly _roomRepository: RoomRepository;
	private readonly _buildingRepository: BuildingRepository;
	private readonly _roomTypeRepository: RoomTypeRepository;

	constructor(
		outputPort: OutputPort<CreateRoomOutput>,
		roomRepository: RoomRepository,
		buildingRepository: BuildingRepository,
		roomTypeRepository: RoomTypeRepository,
	) {
		this._outputPort = outputPort;
		this._roomRepository = roomRepository;
		this._buildingRepository = buildingRepository;
		this._roomTypeRepository = roomTypeRepository;
	}

	public async execute(input: CreateRoomInput): Promise<void> {
		const building = (await this._buildingRepository.find(input.buildingDocumentId)).orElseThrow(() =>
			new BuildingNotFoundError(input.buildingDocumentId)
		);

		const roomType = (await this._roomTypeRepository.find(input.roomTypeDocumentId)).orElseThrow(() =>
			new RoomTypeNotFoundError(input.roomTypeDocumentId)
		);

		const room = Room.create("", input.name, building, roomType);

		await this._roomRepository.save(room);
		this._outputPort.present({ documentId: room.documentId.toString() });
	}
}
