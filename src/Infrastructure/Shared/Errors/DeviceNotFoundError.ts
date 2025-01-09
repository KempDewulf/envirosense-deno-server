export class DeviceNotFoundError extends Error {
	constructor(deviceId: string) {
		super(`Device with ID ${deviceId} not found.`);
		this.name = "DeviceNotFoundError";
	}
}
