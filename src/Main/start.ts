import { WebApiModule } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import {
    DeviceDataStrapiRepository,
    DeviceDataStrapiQueryRepository,
    DeviceStrapiRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";

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

async function findAllRoomTypes(identifier: string = ''): Promise<any> {
    return await repoQuery.all(identifier);
}

async function findDevice(id: string): Promise<any> {
    return await deviceRepo.find(id);
}

async function findRoomTypes(id: string): Promise<any> {
    return await repo.find(id);
}

const deviceFound = await findDevice("himquek1ciicfppeno9sdd59");
const roomTypesFound = await findAllRoomTypes(deviceFound.value.identifier);

console.log(roomTypesFound);
//lw7dl0pg1ysqrkbsab3q7o7a
