import { Device } from "EnviroSense/Domain/mod.ts";
import {
	CreateDeviceInput,
	CreateDeviceOutput,
	DeviceRepository,
	OutputPort,
	RoomRepository,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { RoomNotFoundError } from "EnviroSense/Infrastructure/Shared/mod.ts";

export class CreateDevice implements UseCase<CreateDeviceInput> {
	private readonly _outputPort: OutputPort<CreateDeviceOutput>;
	private readonly _deviceRepository: DeviceRepository;
	private readonly _roomRepository: RoomRepository;

	constructor(
		outputPort: OutputPort<CreateDeviceOutput>,
		_deviceRepository: DeviceRepository,
		_roomRepository: RoomRepository,
	) {
		this._outputPort = outputPort;
		this._deviceRepository = _deviceRepository;
		this._roomRepository = _roomRepository;
	}

	public async execute(input: CreateDeviceInput): Promise<void> {
		const room = (await this._roomRepository.find(input.roomDocumentId)).orElseThrow(() => new RoomNotFoundError(input.roomDocumentId));

		const device = Device.create("", input.identifier, room);

		const strapiResponse = await this._deviceRepository.save(device);
		this._outputPort.present({
			documentId: strapiResponse.data.documentId,
		});
	}
}
