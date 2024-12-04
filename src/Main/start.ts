import { WebApiModule } from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { DeviceStrapiQueryRepository, DeviceStrapiRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { Building } from 'EnviroSense/Domain/mod.ts';

(new WebApiModule(8101)).run();

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
