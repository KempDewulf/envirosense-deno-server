import { Optional, Building } from "EnviroSense/Domain/mod.ts";

export interface BuildingRepository {
    find(buildingId: string): Promise<Optional<Building>>;
    save(building: Building): Promise<void>;
}
