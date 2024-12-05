import { Optional, DeviceData } from "EnviroSense/Domain/mod.ts";

export interface DeviceDataRepository {
    find(deviceDataId: string): Promise<Optional<DeviceData>>;
    save(deviceData: DeviceData): Promise<void>;
    update(deviceData: DeviceData): Promise<void>;
    deleteEntity(deviceData: DeviceData): Promise<void>;
}
