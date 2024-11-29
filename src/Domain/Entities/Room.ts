import { Building, Device, Guid, RoomType } from 'EnviroSense/Domain/mod.ts';

export interface Room {
    id: Guid;
    name: string;
    building: Building;
    roomType: RoomType;
    devices?: Device[];
}
