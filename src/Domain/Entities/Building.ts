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
    private readonly _rooms: Room[];

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
        const tournament = new Building(
            state.id,
            state.name,
            state.address,
            state.rooms || []
        );
        tournament.validateState();

        return tournament;
    }

    public validateState() {
        this.ensureNameIsNotEmpty();
        this.ensureAddressIsNotEmpty();
    }

    public addRoom(room: Room) {
        this.ensureRoomDoesNotExist(room);
        this._rooms.push(room);
    }

    private ensureNameIsNotEmpty() {
        if (!this._name) {
            throw new DomainException("Name is required");
        }
    }

    private ensureAddressIsNotEmpty() {
        if (!this._address) {
            throw new DomainException("Address is required");
        }
    }

    private ensureRoomDoesNotExist(room: Room) {
        if (this._rooms.some((r) => r.id.equals(room.id))) {
            throw new DomainException("Room already exists");
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
