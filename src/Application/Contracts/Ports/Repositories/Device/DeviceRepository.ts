import { Device, Optional } from "EnviroSense/Domain/mod.ts";
import { DeviceDataOperation } from "EnviroSense/Infrastructure/Persistence/mod.ts";

export interface DeviceRepository {
	find(deviceDocumentId: string): Promise<Optional<Device>>;
	findByIdentifier(identifier: string): Promise<Optional<Device>>;
	save(device: Device): Promise<any>;
	update(device: Device): Promise<void>;
	deleteEntity(device: Device): Promise<void>;
	manageDeviceData(
		deviceDocumentId: string,
		deviceDataDocumentIds: string[],
		operation: DeviceDataOperation,
	): Promise<void>;
}
