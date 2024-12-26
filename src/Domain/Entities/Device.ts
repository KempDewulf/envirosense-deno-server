import { DeviceData, DomainException, Room } from "EnviroSense/Domain/mod.ts";

export interface DeviceState {
	documentId: string;
	identifier: string;
	room?: Room | null;
	deviceData?: DeviceData[];
}

export class Device {
	private readonly _id: string;
	private _identifier: string;
	private _room: Room | null;
	private _deviceData: DeviceData[];

	private constructor(
		documentId: string,
		identifier: string,
		room: Room | null,
	) {
		this._id = documentId;
		this._identifier = identifier;
		this._room = room;
		this._deviceData = [];
	}

	static create(documentId: string, identifier: string, room: Room): Device {
		const device = new Device(documentId, identifier, room);
		device.validateState();

		return device;
	}

	static load(state: DeviceState): Device {
		const device = new Device(
			state.documentId,
			state.identifier,
			state.room || null,
		);

		device._deviceData = state.deviceData ?? [];

		device.validateState();

		return device;
	}

	public updateIdentifier(identifier: string): void {
		if (!identifier) {
			throw new DomainException("Identifier is required.");
		}
		this._identifier = identifier;
	}

	public validateState(): void {
		this.ensureIdentifierIsNotEmpty();
	}

	public addDeviceData(deviceData: DeviceData): void {
		if (!deviceData) {
			throw new DomainException("DeviceData is required.");
		}

		this._deviceData.push(deviceData);
	}

	public addRoom(room: Room): void {
		if (room.building === null) {
			throw new DomainException("Room must be assigned to a building");
		}

		room.building.ensureRoomExists(room.documentId);
		this._room = room;
	}

	public removeRoom(): void {
		this.ensureRoomIsNotEmpty();
		this._room = null;
	}

	private ensureIdentifierIsNotEmpty(): void {
		if (!this._identifier) {
			throw new DomainException("Identifier is required.");
		}
	}

	private ensureRoomIsNotEmpty(): void {
		if (!this._room) {
			throw new DomainException("Room is required.");
		}
	}

	get documentId(): string {
		return this._id;
	}

	get identifier(): string {
		return this._identifier;
	}

	set identifier(identifier: string) {
		this._identifier = identifier;
	}

	get room(): Room | null {
		return this._room;
	}

	set room(room: Room | null) {
		this._room = room;
	}

	get deviceData(): DeviceData[] {
		return this._deviceData;
	}

	set deviceData(deviceData: DeviceData[]) {
		this._deviceData = deviceData;
	}
}
