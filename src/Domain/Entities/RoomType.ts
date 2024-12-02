import { DomainException, Guid } from "EnviroSense/Domain/mod.ts";

export interface RoomTypeState {
    id: Guid;
    name: string;
    icon: string;
}

export class RoomType {
    private readonly _id: Guid;
    private readonly _name: string;
    private readonly _icon: string;

    private constructor(id: Guid, name: string, icon: string) {
        this._id = id;
        this._name = name;
        this._icon = icon;
    }

    static create(name: string, icon: string): RoomType {
        const room_type = new RoomType(Guid.create(), name, icon);
        room_type.validateState();

        return room_type;
    }

    static load(state: RoomTypeState): RoomType {
        const room_type = new RoomType(
            state.id,
            state.name,
            state.icon
        );
        room_type.validateState();

        return room_type;
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
}
