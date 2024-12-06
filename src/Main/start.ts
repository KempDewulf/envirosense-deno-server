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
    const roomTypeOptional = await repoQuery.find(roomTypeDocumentId);
    const roomType = roomTypeOptional.orElseThrow(() => new Error("Room type not found"));
    return roomType;
}

const deviceFound = await findRoomType("himquek1ciicfppeno9sdd59");

console.log(roomTypeFound);
//lw7dl0pg1ysqrkbsab3q7o7a
