import { AirData, Device, Optional } from "EnviroSense/Domain/mod.ts";

export interface DeviceDataQueryDto {
    documentId: string;
    documentId: string;
    device: Device;
    timestamp: Date;
    airData: AirData;
}

export interface DeviceDataQueryRepository {
    all(identifier: string): Promise<DeviceDataQueryDto[]>;
    find(deviceDataDocumentId: string): Promise<Optional<DeviceDataQueryDto>>;
}
