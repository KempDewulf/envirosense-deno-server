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

//TODO: invalid relations error due the icon not passing correctly, since icon is seen as relation...