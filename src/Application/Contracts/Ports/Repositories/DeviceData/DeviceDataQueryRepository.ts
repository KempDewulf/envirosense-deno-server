import { Device } from "EnviroSense/Domain/mod.ts";

export interface DeviceDataQueryAllDto {
    id: string;
    documentId: string;
    device: Device;
    timestamp: string;
    temperature: number;
    humidity: number;
    gas_ppm: number;
}

export interface DeviceDataQueryRepository {
    all(identifier: string): Promise<DeviceDataQueryAllDto[]>;
}
