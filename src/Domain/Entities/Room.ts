import { Building, Device, DomainException, RoomType } from "EnviroSense/Domain/mod.ts";

export interface RoomState {
	documentId: string;
	name: string;
	building: Building | null;
	roomType: RoomType;
	devices?: Device[];
}

export class Room {
	private readonly _documentId: string;
	private _name: string;
	private readonly _building: Building | null;
	private readonly _roomType: RoomType;
	private _devices: Device[];

	private constructor(
		documentId: string,
		name: string,
		building: Building | null,
		roomType: RoomType,
	) {
		this._documentId = documentId;
		this._name = name;
		this._building = building;
		this._roomType = roomType;
		this._devices = [];
	}

	static create(
		documentId: string,
		name: string,
		building: Building,
		roomType: RoomType,
	): Room {
		const room = new Room(documentId, name, building, roomType);
		room.validateState();

		return room;
	}

	static load(state: RoomState): Room {
		const room = new Room(
			state.documentId,
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
			throw new DomainException("Room name is required.");
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
			(device) => device.documentId !== deviceDocumentId,
		);
	}

	private ensureNameIsNotEmpty(): void {
		if (!this._name) {
			throw new DomainException("Room name is required.");
		}
	}

	private ensureRoomTypeIsNotEmpty(): void {
		if (!this._roomType) {
			throw new DomainException("Room type is required.");
		}
	}

	private ensureDeviceDoesNotExist(device: Device): void {
		if (this._devices.some((d) => d.documentId === device.documentId)) {
			throw new DomainException("Device already exists in this room.");
		}
	}

	private ensureDeviceExists(deviceDocumentId: string): void {
		if (!this._devices.some((d) => d.documentId === deviceDocumentId)) {
			throw new DomainException("Device does not exist in this room.");
		}
	}

	get documentId(): string {
		return this._documentId;
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

	get devices(): Device[] {
		return this._devices;
	}

	set devices(devices: Device[]) {
		this._devices = devices;
	}
}
