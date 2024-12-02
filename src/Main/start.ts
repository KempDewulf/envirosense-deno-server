import { WebApiModule } from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { RoomStrapiRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { Building, Room, RoomType } from 'EnviroSense/Domain/mod.ts';

(new WebApiModule(8101)).run();

async function createRoom(): Promise<any> {
    const repo = new RoomStrapiRepository();
    const building = Building.create('Building 1', 'Building 1 address');
    const roomType = RoomType.create('bedroom test', 'bedroom.png');
    const roomModel = Room.create('Room Test', building, roomType);

    return await repo.save(roomModel);
}

const room = await createRoom();
console.log(room);