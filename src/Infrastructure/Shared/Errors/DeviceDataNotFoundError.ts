export class DeviceDataNotFoundError extends Error {
	constructor(deviceDataId: string) {
		super(`DeviceData with ID ${deviceDataId} not found.`);
		this.name = "DeviceDataNotFoundError";
	}
}
