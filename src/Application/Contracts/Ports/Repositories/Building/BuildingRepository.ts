import { Optional, Building } from "EnviroSense/Domain/mod.ts";
import { RoomOperation } from 'EnviroSense/Infrastructure/Persistence/mod.ts';

export interface BuildingRepository {
    find(buildingId: string): Promise<Optional<Building>>;
    save(building: Building): Promise<void>;
    update(building: Building): Promise<void>;
    deleteEntity(building: Building): Promise<void>;
    manageRooms(buildingId: string, roomDocumentIds: string[], Rooperation: RoomOperation): Promise<void>;
}
