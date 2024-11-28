import { Room } from 'EnviroSense/Domain/Entities/Room.ts';

export interface Building {
    id: string;
    name: string;
    address: string;
    rooms?: Room[];
}