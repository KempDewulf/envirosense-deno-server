import { Router, RouterContext } from "@oak/oak";
import {
    Endpoint,
    TestEndpoint,
    ShowRoomsEndpoint,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ShowBuildingsEndpoint } from 'EnviroSense/Infrastructure/WebApi/Endpoints/ShowBuildingsEndpoint.ts';

function use(endpoint: Endpoint) {
    return (context: RouterContext<string>) => endpoint.handle(context);
}

export function endpoints(): Router {
    const router = new Router();

    router.get("/", use(new TestEndpoint())); //maybe show docs of openApi.yml?
    router.get("/rooms", use(new ShowRoomsEndpoint()));
    router.get("/buildings", use(new ShowBuildingsEndpoint()));

    return router;
}
