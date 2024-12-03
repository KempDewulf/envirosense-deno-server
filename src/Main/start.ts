import { WebApiModule } from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { BuildingStrapiQueryRepository, BuildingStrapiRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { Building } from 'EnviroSense/Domain/mod.ts';

(new WebApiModule(8101)).run();

const repo = new BuildingStrapiRepository();
const repoQuery = new BuildingStrapiQueryRepository();

async function createBuilding(): Promise<any> {
    const buildingModel = Building.create('', 'Building Test', 'Building test description');
    return await repo.save(buildingModel);
}

async function findAllBuildings(name: string = ''): Promise<any> {
    return await repoQuery.all(name);
}

async function findBuilding(id: string): Promise<any> {
    return await repo.find(id);
}

const buildingFound = await findAllBuildings('');

console.log(buildingFound);