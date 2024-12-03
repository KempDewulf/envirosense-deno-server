import { WebApiModule } from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { RoomStrapiRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { Building, Room, RoomType } from 'EnviroSense/Domain/mod.ts';

(new WebApiModule(8101)).run();

async function createRoom(): Promise<any> {
    const repo = new RoomStrapiRepository();
    //find building with id just general fetch it from our api strapi
    let building = await fetch('http://94.130.75.173:1331/api/buildings/gox5y6bsrg640qb11ak44dh0?populate=*').then(res => res.json());
    building = Building.create(building.data.name, building.data.address);
    //create roomtype
    let roomType = await fetch('http://94.130.75.173:1331/api/room-types/tp7ww9orfq7gs00prq8azupq?populate=*').then(res => res.json());
    roomType = RoomType.create(roomType.data.name, roomType.data.icon.name);

    const roomModel = Room.create('Room 1', building, roomType);
    return await repo.save(roomModel);
}

const room = await createRoom();
console.log(room);