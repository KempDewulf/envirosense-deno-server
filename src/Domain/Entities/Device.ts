import { DeviceData } from 'EnviroSense/Domain/Entities/DeviceData.ts';
import { Room } from './Room.ts';

export interface DeviceState {
    id: string;
    identifier: string;
    room: Room;
    deviceData?: DeviceData[];
}
