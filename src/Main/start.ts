import { WebApiModule } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import {
    RoomTypeStrapiRepository,
    RoomTypeStrapiQueryRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { DeviceStrapiQueryRepository, DeviceStrapiRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { Building } from 'EnviroSense/Domain/mod.ts';
import { Messaging } from 'EnviroSense/Infrastructure/Messaging/mod.ts';

new WebApiModule(8101).run();

const repo = new RoomTypeStrapiRepository();
const repoQuery = new RoomTypeStrapiQueryRepository();
const mqttClient = new Messaging();

async function logMessages() {
    await mqttClient.connect();
    await mqttClient.subscribe('test/test1');
}

//logMessages();

async function findAllRoomTypess(name: string = ""): Promise<any> {
    return await repoQuery.all(name);
}

async function findRoomTypes(id: string): Promise<any> {
    return await repo.find(id);
}

const roomTypesFound = await findAllRoomTypess();

console.log(roomTypesFound);
