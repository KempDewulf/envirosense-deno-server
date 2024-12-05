import { Optional, Device } from "EnviroSense/Domain/mod.ts";

export interface DeviceRepository {
    find(deviceId: string): Promise<Optional<Device>>;
    save(device: Device): Promise<void>;
    update(device: Device): Promise<void>;
    deleteEntity(device: Device): Promise<void>;
}
