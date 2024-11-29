import { Room, Guid } from "EnviroSense/Domain/mod.ts";
import { DomainException } from "EnviroSense/Domain/Shared/Exceptions/DomainException.ts";

export interface BuildingState {
    id: Guid;
    name: string;
    address: string;
    rooms?: Room[];
}

export class Building {
    private readonly _id: Guid;
    private readonly _name: string;
    private readonly _address: string;
    private _rooms: Room[];

    private constructor(
        id: Guid,
        name: string,
        address: string,
        rooms: Room[]
    ) {
        this._id = id;
        this._name = name;
        this._address = address;
        this._rooms = rooms;
    }

    static create(name: string, address: string, rooms: Room[]): Building {
        const building = new Building(Guid.create(), name, address, rooms);
        building.validateState();

        return building;
    }

    static load(state: BuildingState): Building {
        const building = new Building(
            state.id,
            state.name,
            state.address,
            state.rooms || []
        );
        building.validateState();

        return building;
    }

    public validateState(): void {
        this.ensureNameIsNotEmpty();
        this.ensureAddressIsNotEmpty();
    }

    public addRoom(room: Room): void {
        this.ensureRoomDoesNotExist(room);

        this._rooms.push(room);
    }

    public removeRoom(roomId: Guid): void {
        this.ensureRoomExists(roomId);

        this._rooms = this._rooms.filter((room) => !room.id.isEqual(roomId));
    }

    private ensureNameIsNotEmpty(): void {
        if (!this._name) {
            throw new DomainException("Name is required");
        }
    }

    private ensureAddressIsNotEmpty(): void {
        if (!this._address) {
            throw new DomainException("Address is required");
        }
    }

    private ensureRoomDoesNotExist(room: Room): void {
        if (this._rooms.some((r) => r.id.isEqual(room.id))) {
            throw new DomainException("Room already exists");
        }
    }

    public ensureRoomExists(roomId: Guid): void {
        if (!this._rooms.some((room) => room.id.isEqual(roomId))) {
            throw new DomainException("Room does not exist");
        }
    }

    get id(): Guid {
        return this._id;
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
