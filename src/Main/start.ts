import { WebApiModule } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import {
    DeviceDataStrapiRepository,
    DeviceDataStrapiQueryRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { Device } from "EnviroSense/Domain/mod.ts";

new WebApiModule(8101).run();

const repo = new DeviceDataStrapiRepository();
const repoQuery = new DeviceDataStrapiQueryRepository();
const mqttClient = new Messaging();

async function logMessages() {
    await mqttClient.connect();
    await mqttClient.subscribe("test/test1");
}

//logMessages();

async function findAllRoomTypes(device: Device | null = null): Promise<any> {
    return await repoQuery.all(device);
}

async function findRoomTypes(id: string): Promise<any> {
    return await repo.find(id);
}

const roomTypesFound = await findAllRoomTypes();

console.log(roomTypesFound);
