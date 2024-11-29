import { DeviceData, Guid, Room } from 'EnviroSense/Domain/mod.ts';

export interface DeviceState {
    id: string;
    identifier: string;
    room: Room;
    deviceData?: DeviceData[];
}

export class Device {
    private readonly _id: string;
    private readonly _identifier: string;
    private readonly _room: Room;
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

    static create(identifier: string, room: Room, deviceData: DeviceData[]): Device {
        const device = new Device(Guid.create().value, identifier, room, deviceData);
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

    private ensureIdentifierIsNotEmpty() {
        if (!this._identifier) {
            throw new DomainException("Identifier is required");
        }
    }
}
