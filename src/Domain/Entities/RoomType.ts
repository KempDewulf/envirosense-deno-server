import { Room } from 'EnviroSense/Domain/Entities/Room.ts';

export interface RoomType {
    id: string;
    name: string;
    icon: string;
    rooms?: Room[];
}