import { Room } from 'EnviroSense/Domain/mod.ts';

export interface Building {
    id: string;
    name: string;
    address: string;
    rooms?: Room[];
}

