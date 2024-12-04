import { WebApiModule } from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { DeviceStrapiQueryRepository, DeviceStrapiRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
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
const repo = new DeviceStrapiRepository();
const repoQuery = new DeviceStrapiQueryRepository();

async function createDevice(): Promise<any> {
    const buildingModel = Building.create('', 'Building Test', 'Building test description');
    return await repo.save(buildingModel);
}

async function findAllDevices(name: string = ''): Promise<any> {
    return await repoQuery.all(name);
}

async function findDevice(id: string): Promise<any> {
    return await repo.find(id);
}

const devicesFound = await findAllDevices();

console.log(devicesFound);
