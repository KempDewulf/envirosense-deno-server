import { Room } from './Room.ts';

export interface Device {
    id: string;
    identifier: string;
    room: Room;
    deviceData?: DeviceData[];
}