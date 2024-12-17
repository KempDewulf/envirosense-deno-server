import { Building, Optional } from "EnviroSense/Domain/mod.ts";
import { RoomOperation } from "EnviroSense/Infrastructure/Persistence/mod.ts";

export interface BuildingRepository {
	find(buildingDocumentId: string): Promise<Optional<Building>>;
	save(building: Building): Promise<void>;
	update(building: Building): Promise<void>;
	deleteEntity(building: Building): Promise<void>;
	manageRooms(
		buildingDocumentId: string,
		roomDocumentIds: string[],
		Rooperation: RoomOperation,
	): Promise<void>;
}
