import { Room } from 'EnviroSense/Domain/Entities/Room.ts';

export interface BuildingState {
    id: string;
    name: string;
    address: string;
    rooms?: Room[];
}
