import { DomainException, Room } from "EnviroSense/Domain/mod.ts";

export interface BuildingState {
	documentId: string;
	name: string;
	address: string;
	rooms?: Room[];
}

export class Building {
	private readonly _documentId: string;
	private _name: string;
	private _address: string;
	private _rooms: Room[] = [];

	private constructor(
		documentId: string,
		name: string,
		address: string,
		rooms?: Room[],
	) {
		this._documentId = documentId;
		this._name = name;
		this._address = address;
		this._rooms = rooms ?? [];
	}

	static create(documentId: string, name: string, address: string): Building {
		const building = new Building(documentId, name, address);
		building.validateState();

		return building;
	}

	static load(state: BuildingState): Building {
		const building = new Building(
			state.documentId,
			state.name,
			state.address,
			state.rooms,
		);
		building.validateState();

		return building;
	}

	public updateName(name: string): void {
		if (!name) {
			throw new DomainException("Name is required.");
		}
		this._name = name;
	}

	public updateAddress(address: string): void {
		if (!address) {
			throw new DomainException("Address is required.");
		}
		this._address = address;
	}

	public validateState(): void {
		this.ensureNameIsNotEmpty();
		this.ensureAddressIsNotEmpty();
	}

	public addRoom(room: Room): void {
		this.ensureRoomDoesNotExist(room);

		this._rooms.push(room);
	}

	public removeRoom(roomDocumentId: string): void {
		this.ensureRoomExists(roomDocumentId);

		this._rooms = this._rooms.filter(
			(room) => room.documentId !== roomDocumentId,
		);
	}

	private ensureNameIsNotEmpty(): void {
		if (!this._name) {
			throw new DomainException("Name is required.");
		}
	}

	private ensureAddressIsNotEmpty(): void {
		if (!this._address) {
			throw new DomainException("Address is required.");
		}
	}

	private ensureRoomDoesNotExist(room: Room): void {
		if (this._rooms.some((r) => r.documentId === room.documentId)) {
			throw new DomainException(`Room ${room.documentId} already exists`);
		}
	}

	public ensureRoomExists(roomDocumentId: string): void {
		if (!this._rooms.some((room) => room.documentId === roomDocumentId)) {
			throw new DomainException(`Room does not exist`);
		}
	}

	get documentId(): string {
		return this._documentId;
	}

	get name(): string {
		return this._name;
	}

	get address(): string {
		return this._address;
	}

	get rooms(): Room[] {
		return this._rooms;
	}
}
