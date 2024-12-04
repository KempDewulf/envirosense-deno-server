import { Optional, DeviceData } from "EnviroSense/Domain/mod.ts";

export interface DeviceDataRepository {
    find(deviceDataId: string): Promise<Optional<DeviceData>>;
    save(deviceData: DeviceData): Promise<void>;
}
