import { DeviceData, Optional, Room } from "EnviroSense/Domain/mod.ts";

export interface DeviceQueryDto {
    documentId: string;
    documentId: string;
    identifier: string;
    room: Room;
    device_data: DeviceData[];
}

export interface DeviceQueryRepository {
    all(identifier: string): Promise<DeviceQueryDto[]>;
    find(deviceDocumentId: string): Promise<Optional<DeviceQueryDto>>;
}
