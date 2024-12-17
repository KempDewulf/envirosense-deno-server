import { Device, Optional } from "EnviroSense/Domain/mod.ts";
import { DeviceDataOperation } from "EnviroSense/Infrastructure/Persistence/Repositories/Strapi/Device/DeviceStrapiRepository.ts";

export interface DeviceRepository {
	find(deviceDocumentId: string): Promise<Optional<Device>>;
	findByIdentifier(identifier: string): Promise<Optional<Device>>;
	save(device: Device): Promise<void>;
	update(device: Device): Promise<void>;
	deleteEntity(device: Device): Promise<void>;
	manageDeviceData(
		deviceDocumentId: string,
		deviceDataDocumentIds: string[],
		operation: DeviceDataOperation,
	): Promise<void>;
}
