import { DomainException, Guid, Room } from "EnviroSense/Domain/mod.ts";

export interface RoomTypeState {
    id: Guid;
    name: string;
    icon: string;
    rooms?: Room[];
}

export class RoomType {
    private readonly _id: Guid;
    private readonly _name: string;
    private readonly _icon: string;
    private _rooms: Room[];

    private constructor(id: Guid, name: string, icon: string, rooms: Room[]) {
        this._id = id;
        this._name = name;
        this._icon = icon;
        this._rooms = rooms;
    }

    static create(name: string, icon: string, rooms: Room[]): RoomType {
        const roomType = new RoomType(Guid.create(), name, icon, rooms);
        roomType.validateState();

        return roomType;
    }

    static load(state: RoomTypeState): RoomType {
        const roomType = new RoomType(
            state.id,
            state.name,
            state.icon,
            state.rooms || []
        );
        roomType.validateState();

        return roomType;
    }

    public validateState(): void {
        this.ensureNameIsNotEmpty();
        this.ensureIconIsNotEmpty();
    }

    private ensureNameIsNotEmpty(): void {
        if (!this._name) {
            throw new DomainException("Room type name cannot be empty.");
        }
    }

    private ensureIconIsNotEmpty(): void {
        if (!this._icon) {
            throw new DomainException("Room type icon cannot be empty.");
        }
    }

    get id(): Guid {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get icon(): string {
        return this._icon;
    }

    get rooms(): Room[] {
        return this._rooms;
    }
}
