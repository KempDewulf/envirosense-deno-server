import {
    Building,
    Device,
    DomainException,
    Guid,
    RoomType,
} from "EnviroSense/Domain/mod.ts";

export interface RoomState {
    id: Guid;
    name: string;
    building: Building;
    roomType: RoomType;
    devices?: Device[];
}

export class Room {
    private readonly _id: Guid;
    private readonly _name: string;
    private readonly _building: Building;
    private readonly _roomType: RoomType;
    private _devices: Device[];

    private constructor(
        id: Guid,
        name: string,
        building: Building,
        roomType: RoomType
    ) {
        this._id = id;
        this._name = name;
        this._building = building;
        this._roomType = roomType;
        this._devices = [];
    }

    static create(
        name: string,
        building: Building,
        roomType: RoomType
    ): Room {
        const room = new Room(Guid.create(), name, building, roomType);
        room.validateState();

        return room;
    }

    static load(state: RoomState): Room {
        const room = new Room(
            state.id,
            state.name,
            state.building,
            state.roomType
        );
        room.validateState();

        return room;
    }

    public validateState(): void {
        this.ensureNameIsNotEmpty();
        this.ensureBuildingIsNotEmpty();
        this.ensureRoomTypeIsNotEmpty();
    }

    public addDevice(device: Device): void {
        this.ensureDeviceDoesNotExist(device);

        this._devices.push(device);
    }

    public removeDevice(deviceId: Guid): void {
        this.ensureDeviceExists(deviceId);

        this._devices = this._devices.filter(
            (device) => device.id !== deviceId
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

    private ensureBuildingIsNotEmpty(): void {
        if (!this._building) {
            throw new DomainException("Building cannot be empty.");
        }
    }

    private ensureDeviceDoesNotExist(device: Device): void {
        if (this._devices.some((d) => d.id === device.id)) {
            throw new DomainException("Device already exists in this room.");
        }
    }

    private ensureDeviceExists(deviceId: Guid): void {
        if (!this._devices.some((d) => d.id === deviceId)) {
            throw new DomainException("Device does not exist in this room.");
        }
    }

    get id(): Guid {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get building(): Building {
        return this._building;
    }

    get roomType(): RoomType {
        return this._roomType;
    }

    get devices(): Device[] {
        return this._devices;
    }
}
