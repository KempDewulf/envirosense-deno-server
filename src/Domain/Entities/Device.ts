import { DeviceData, Room } from 'EnviroSense/Domain/mod.ts';

export interface Device {
    id: string;
    identifier: string;
    room: Room;
    deviceData?: DeviceData[];
}
