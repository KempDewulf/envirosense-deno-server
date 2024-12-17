import { Room } from 'EnviroSense/Domain/mod.ts';

export interface ShowRoomTypeByDocumentIdOutput {
    id: string;
    documentId: string;
    name: string;
    icon: string;
    rooms: Room[];
}
