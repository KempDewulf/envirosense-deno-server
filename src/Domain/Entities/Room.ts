import {
	Building,
	Device,
	DomainException,
	RoomType,
} from "EnviroSense/Domain/mod.ts";

export interface RoomState {
	id: string;
	name: string;
	building: Building | null;
	roomType: RoomType;
	devices?: Device[];
}

export class Room {
	private readonly _id: string;
	private _name: string;
	private readonly _building: Building | null;
	private readonly _roomType: RoomType;
	private _devices: Device[];

	private constructor(
		id: string,
		name: string,
		building: Building | null,
		roomType: RoomType,
	) {
		this._id = id;
		this._name = name;
		this._building = building;
		this._roomType = roomType;
		this._devices = [];
	}

	static create(
		id: string,
		name: string,
		building: Building,
		roomType: RoomType,
	): Room {
		const room = new Room(id, name, building, roomType);
		room.validateState();

		return room;
	}

	static load(state: RoomState): Room {
		const room = new Room(
			state.id,
			state.name,
			state.building,
			state.roomType ??
				(() => {
					throw new DomainException("Room type cannot be null.");
				})(),
		);

		room._devices = state.devices ?? [];

		room.validateState();

		return room;
	}

	public updateName(name: string): void {
		if (!name) {
			throw new DomainException("Room name cannot be empty.");
		}
		this._name = name;
	}

	public validateState(): void {
		this.ensureNameIsNotEmpty();
		this.ensureRoomTypeIsNotEmpty();
	}

	public addDevice(device: Device): void {
		this.ensureDeviceDoesNotExist(device);

		this._devices.push(device);
	}

	public removeDevice(deviceDocumentId: string): void {
		this.ensureDeviceExists(deviceDocumentId);

		this._devices = this._devices.filter(
			(device) => device.id !== deviceDocumentId,
		);
	}

	private ensureNameIsNotEmpty(): void {
		if (!this._name) {
			throw new DomainException("Room name cannot be empty.");
		}
	}

	private ensureRoomTypeIsNotEmpty(): void {
		if (!this._roomType) {
			throw new DomainException("Room type cannot be empty.");
		}
	}

	//TODO(@layton): check this later when all room endpoints are made, if we can change this to documentId if needed, if not, great!
	private ensureDeviceDoesNotExist(device: Device): void {
		if (this._devices.some((d) => d.id === device.id)) {
			throw new DomainException("Device already exists in this room.");
		}
	}

	//TODO(@layton): check this later when all room endpoints are made, if we can change this to documentId if needed, if not, great!
	private ensureDeviceExists(deviceDocumentId: string): void {
		if (!this._devices.some((d) => d.id === deviceDocumentId)) {
			throw new DomainException("Device does not exist in this room.");
		}
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get building(): Building | null {
		return this._building;
	}

	get roomType(): RoomType {
		return this._roomType;
	}

	get ["room-type"](): RoomType {
		return this._roomType;
	}

	get devices(): Device[] {
		return this._devices;
	}
}
