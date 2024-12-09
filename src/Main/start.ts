import { WebApiModule } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import {
    DeviceDataStrapiRepository,
    DeviceDataStrapiQueryRepository,
    DeviceStrapiRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { MessagingModule } from "EnviroSense/Infrastructure/Messaging/MessagingModule.ts";


new WebApiModule(8101).run();
new MessagingModule().run();

const repo = new DeviceDataStrapiRepository();
const repoQuery = new DeviceDataStrapiQueryRepository();
const deviceRepo = new DeviceStrapiRepository();

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
