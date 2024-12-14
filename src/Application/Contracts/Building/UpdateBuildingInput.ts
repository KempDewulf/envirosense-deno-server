import { Room } from 'EnviroSense/Domain/mod.ts';

export interface UpdateBuildingInput {
    buildingDocumentId: string;
    name: string;
    address: string;
    rooms: Room[];
}
