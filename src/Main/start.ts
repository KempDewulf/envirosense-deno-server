import { WebApiModule } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import {
    RoomTypeStrapiRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";

new WebApiModule(8101).run();

const repoQuery = new RoomTypeStrapiRepository();

//TODO: findById: invalid relations error due the icon not passing correctly, since icon is seen as relation...