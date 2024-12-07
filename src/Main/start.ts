import { WebApiModule } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import {
    RoomTypeStrapiRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { RoomType } from 'EnviroSense/Domain/mod.ts';

new WebApiModule(8101).run();

const repoQuery = new RoomTypeStrapiRepository();
const mqttClient = new Messaging();

async function logMessages() {
    await mqttClient.connect();
    await mqttClient.subscribe("test/test1");
}

//logMessages();

const roomType = RoomType.create(
            '',
            "test2",
            "e12wm2zjfp39bwweq145jb08",
        );
const roomTypeResult = await repoQuery.save(roomType);

console.log(roomTypeResult);
//lw7dl0pg1ysqrkbsab3q7o7a
