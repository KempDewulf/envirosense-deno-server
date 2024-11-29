import { Guid, Room } from 'EnviroSense/Domain/mod.ts';

export interface RoomType {
    id: Guid;
    name: string;
    icon: string;
    rooms?: Room[];
}
