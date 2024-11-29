import { Building, Device, RoomType } from 'EnviroSense/Domain/mod.ts';

export interface Room {
    id: string;
    name: string;
    building: Building;
    roomType: RoomType;
    devices?: Device[];
}
