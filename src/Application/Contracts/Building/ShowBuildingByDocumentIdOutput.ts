import { Room } from 'EnviroSense/Domain/mod.ts';

export interface ShowBuildingByDocumentIdOutput {
    id: string;
    documentId: string;
    name: string;
    address: string;
    rooms: Room[];
}
