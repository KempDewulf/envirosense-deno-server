import { Room } from 'EnviroSense/Domain/mod.ts';

export interface RoomType {
    id: string;
    name: string;
    icon: string;
    rooms?: Room[];
}
