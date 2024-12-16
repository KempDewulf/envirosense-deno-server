import { DeviceData, Room } from 'EnviroSense/Domain/mod.ts';

export interface CreateDeviceInput {
    identifier: string;
    room: Room;
    device_data: DeviceData[];
}
