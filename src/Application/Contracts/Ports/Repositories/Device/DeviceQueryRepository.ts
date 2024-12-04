import { DeviceData, Room } from "EnviroSense/Domain/mod.ts";

export interface DeviceQueryAllDto {
    id: string;
    documentId: string;
    identifier: string;
    room: Room;
    device_data: DeviceData[];
}

export interface DeviceQueryRepository {
    all(identifier: string): Promise<DeviceQueryAllDto[]>;
}
