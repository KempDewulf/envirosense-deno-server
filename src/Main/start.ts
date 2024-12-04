import { WebApiModule } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import {
    DeviceDataStrapiRepository,
    DeviceDataStrapiQueryRepository,
    DeviceStrapiQueryRepository,
    DeviceStrapiRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { Device } from "EnviroSense/Domain/mod.ts";

new WebApiModule(8101).run();

const repo = new DeviceDataStrapiRepository();
const repoQuery = new DeviceDataStrapiQueryRepository();
const deviceRepo = new DeviceStrapiRepository();
const mqttClient = new Messaging();

async function logMessages() {
    await mqttClient.connect();
    await mqttClient.subscribe("test/test1");
}

//logMessages();

async function findAllRoomTypes(device: Device | null = null): Promise<any> {
    return await repoQuery.all(device);
}

async function findDevice(id: string): Promise<any> {
    return await deviceRepo.find(id);
}

async function findRoomTypes(id: string): Promise<any> {
    return await repo.find(id);
}

const deviceFound = await findDevice("w7v8g55kcsl7qm5my9gseeou");
const roomTypesFound = await findAllRoomTypes(deviceFound);

console.log(roomTypesFound);
//lw7dl0pg1ysqrkbsab3q7o7a
