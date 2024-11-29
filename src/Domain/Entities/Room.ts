import { Building } from './Building.ts';
import { Device } from 'EnviroSense/Domain/Entities/Device.ts';
import { RoomType } from './RoomType.ts';

export interface RoomState {
    id: string;
    name: string;
    building: Building;
    roomType: RoomType;
    devices?: Device[];
}
