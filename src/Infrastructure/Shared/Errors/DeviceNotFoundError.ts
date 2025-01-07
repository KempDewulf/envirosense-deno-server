export class DeviceNotFoundError extends Error {
	constructor(deviceId: string) {
		super(`Building with ID ${deviceId} not found.`);
		this.name = "BuildingNotFoundError";
	}
}
