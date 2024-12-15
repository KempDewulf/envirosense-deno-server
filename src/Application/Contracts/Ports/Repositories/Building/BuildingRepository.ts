import { Optional, Building } from "EnviroSense/Domain/mod.ts";

export interface BuildingRepository {
    find(buildingId: string): Promise<Optional<Building>>;
    save(building: Building): Promise<void>;
    update(building: Building): Promise<void>;
    deleteEntity(building: Building): Promise<void>;
    addRooms(buildingId: string, roomDocumentIds: string[]): Promise<void>;
}
