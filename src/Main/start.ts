import { WebApiModule } from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { BuildingStrapiQueryRepository, BuildingStrapiRepository, RoomStrapiQueryRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { Building } from 'EnviroSense/Domain/mod.ts';
import { Messaging } from 'EnviroSense/Infrastructure/Messaging/mod.ts';

(new WebApiModule(8101)).run();

const repo = new BuildingStrapiRepository();
const repoQuery = new BuildingStrapiQueryRepository();
const repoQueryRooms = new RoomStrapiQueryRepository();
const mqttClient = new Messaging();

async function logMessages() {
    await mqttClient.connect();
    await mqttClient.subscribe('test/test1');
}

//logMessages();

async function createBuilding(): Promise<any> {
    const buildingModel = Building.create('', 'Building Test', 'Building test description');
    return await repo.save(buildingModel);
}

async function findAllBuildings(name: string = ''): Promise<any> {
    return await repoQuery.all(name);
}

async function findAllRooms(name: string = ''): Promise<any> {
    return await repoQueryRooms.all(name);
}

async function findBuilding(id: string): Promise<any> {
    return await repo.find(id);
}

const buildingFound = await findAllRooms();

console.log(buildingFound);