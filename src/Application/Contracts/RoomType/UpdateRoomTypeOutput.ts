import { Room } from 'EnviroSense/Domain/mod.ts';

export interface UpdateRoomTypeOutput {
    id: string;
    documentId: string;
    name: string;
    icon: string;
    rooms: Room[];
}
