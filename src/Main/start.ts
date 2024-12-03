import { WebApiModule } from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { RoomStrapiRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { Building, Room, RoomType } from 'EnviroSense/Domain/mod.ts';

(new WebApiModule(8101)).run();

async function createRoom(): Promise<any> {
    const repo = new RoomStrapiRepository();

    let building = await fetch('http://94.130.75.173:1331/api/buildings/gox5y6bsrg640qb11ak44dh0?populate=*').then(res => res.json());
    building = Building.create(building.data.documentId, building.data.name, building.data.address);

    let roomType = await fetch('http://94.130.75.173:1331/api/room-types/hd3f8ql67kwhzmbqllumnbdi?populate=*').then(res => res.json());
    roomType = RoomType.create(roomType.data.documentId, roomType.data.name, roomType.data.icon.name);

    const roomModel = Room.create('', 'Test Classroom', building, roomType);
    return await repo.save(roomModel);
}

const room = await createRoom();

console.log(room);