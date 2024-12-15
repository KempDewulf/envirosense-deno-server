import { Room } from 'EnviroSense/Domain/mod.ts';

export interface CreateBuildingInput {
    name: string;
    address: string;
    rooms: Room[];
}
