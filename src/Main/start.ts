import { WebApiModule } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import {
    DeviceDataStrapiRepository,
    DeviceDataStrapiQueryRepository,
    DeviceStrapiRepository,
    RoomTypeStrapiQueryRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";

new WebApiModule(8101).run();

const repoQuery = new RoomTypeStrapiQueryRepository();
const mqttClient = new Messaging();

async function logMessages() {
    await mqttClient.connect();
    await mqttClient.subscribe("test/test1");
}

//logMessages();

async function findRoomType(roomTypeDocumentId: string): Promise<any> {
    return await deviceRepo.find(roomTypeDocumentId);
}

const deviceFound = await findDevice("himquek1ciicfppeno9sdd59");
const roomTypeFound = await findAllRoomTypes(deviceFound.value.identifier);

console.log(roomTypeFound);
//lw7dl0pg1ysqrkbsab3q7o7a
