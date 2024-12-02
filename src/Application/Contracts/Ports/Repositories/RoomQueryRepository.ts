import { Building, Device, RoomType } from 'EnviroSense/Domain/mod.ts';

export interface RoomQueryAllDto {
    id: string;
    name: string;
    building: Building;
    room_type: RoomType[];
    devices: Device[];
}

export interface RoomQueryRepository {
    all(name: string): Promise<RoomQueryAllDto[]>;
}
