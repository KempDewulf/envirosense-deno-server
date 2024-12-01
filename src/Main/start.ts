import { WebApiModule } from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { RoomStrapiRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { Building, Guid, Room, RoomType } from 'EnviroSense/Domain/mod.ts';

(new WebApiModule(8101)).run();

const repo = new RoomStrapiRepository();
const building = Building.create('Building Test', 'Teststraat 3');
const roomType = RoomType.create("Office", "officeIcon");
const roomToBeSaved = Room.create();

const room = await repo.save();
console.log(room);