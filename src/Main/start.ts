import { WebApiModule } from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { RoomStrapiQueryRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';

(new WebApiModule(8101)).run();

async function getAllRooms(): Promise<any> {
    const repo = new RoomStrapiQueryRepository();
    const rooms =  await repo.all('');
    return rooms;
}

const rooms = await getAllRooms();
console.log(rooms);