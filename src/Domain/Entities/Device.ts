import {
    DeviceData,
    DomainException,
    Guid,
    Room,
} from "EnviroSense/Domain/mod.ts";

export interface DeviceState {
    id: Guid;
    identifier: string;
    room: Room;
    deviceData?: DeviceData[];
}

export class Device {
    private readonly _id: Guid;
    private readonly _identifier: string;
    private _room: Room | null;
    private readonly _deviceData: DeviceData[];

    private constructor(
        id: Guid,
        identifier: string,
        room: Room,
        deviceData: DeviceData[]
    ) {
        this._id = id;
        this._identifier = identifier;
        this._room = room;
        this._deviceData = deviceData;
    }

    static create(
        identifier: string,
        room: Room,
        deviceData: DeviceData[]
    ): Device {
        const device = new Device(Guid.create(), identifier, room, deviceData);
        device.validateState();

        return device;
    }

    static load(state: DeviceState): Device {
        const device = new Device(
            state.id,
            state.identifier,
            state.room,
            state.deviceData || []
        );

        device.validateState();

        return device;
    }

    public validateState() {
        this.ensureIdentifierIsNotEmpty();
    }

    public addDeviceData(deviceData: DeviceData) {
        this._deviceData.push(deviceData);
    }

    public addRoom(room: Room) {
        room.building.ensureRoomExists(room.id);
        this._room = room;
    }

    public removeRoom() {
        this.ensureRoomIsNotEmpty();
        this._room = null;
    }

    private ensureIdentifierIsNotEmpty() {
        if (!this._identifier) {
            throw new DomainException("Identifier is required");
        }
    }

    private ensureRoomIsNotEmpty() {
        if (!this._room) {
            throw new DomainException("Room is required");
        }
    }

    get id() {
        return this._id;
    }

    get identifier() {
        return this._identifier;
    }

    get room() {
        return this._room;
    }

    get deviceData() {
        return this._deviceData;
    }
}
