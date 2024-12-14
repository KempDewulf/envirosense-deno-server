import { Room } from 'EnviroSense/Domain/mod.ts';

export interface UpdateBuildingOutput {
    id: string;
    name: string;
    address: string;
    rooms: Room[];
}
