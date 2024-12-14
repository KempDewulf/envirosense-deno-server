import { Optional, Room } from "EnviroSense/Domain/mod.ts";

export interface BuildingQueryDto {
    id: string;
    documentId: string;
    name: string;
    address: string;
    rooms: Room[];
}

export interface BuildingQueryRepository {
    all(name: string): Promise<BuildingQueryDto[]>;
    find(buildingDocumentId: string): Promise<Optional<BuildingQueryDto>>
}
