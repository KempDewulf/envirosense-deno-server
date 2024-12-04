import { WebApiModule } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import {
    RoomTypeStrapiRepository,
    RoomTypeStrapiQueryRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";

new WebApiModule(8101).run();

const repo = new RoomTypeStrapiRepository();
const repoQuery = new RoomTypeStrapiQueryRepository();

async function findAllRoomTypess(name: string = ""): Promise<any> {
    return await repoQuery.all(name);
}

async function findRoomTypes(id: string): Promise<any> {
    return await repo.find(id);
}

const roomTypesFound = await findAllRoomTypess();

console.log(roomTypesFound);
