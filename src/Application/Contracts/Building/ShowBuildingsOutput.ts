import { Room } from 'EnviroSense/Domain/mod.ts';

export interface ShowBuildingsOutput {
    id: string;
    documentId: string;
    name: string;
    address: string;
    rooms: Room[];
}
