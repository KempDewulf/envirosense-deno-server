export class BuildingNotFoundError extends Error {
	constructor(buildingId: string) {
		super(`Building with ID ${buildingId} not found.`);
		this.name = "BuildingNotFoundError";
	}
}
