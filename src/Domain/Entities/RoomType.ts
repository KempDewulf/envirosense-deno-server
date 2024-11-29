import { Room } from 'EnviroSense/Domain/Entities/Room.ts';

export interface RoomTypeState {
    id: string;
    name: string;
    icon: string;
    rooms?: Room[];
}
