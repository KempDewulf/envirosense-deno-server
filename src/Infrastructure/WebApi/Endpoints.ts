import { Router, RouterContext } from '@oak/oak';
import {
    Endpoint,
    ShowBuildingsEndpoint,
    ShowDeviceDataEndpoint,
    ShowRoomsEndpoint,
    ShowRoomTypeByDocumentIdEndpoint,
    ShowRoomTypesEndpoint,
    TestEndpoint,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';

function use(endpoint: Endpoint) {
    return (context: RouterContext<string>) => endpoint.handle(context);
}

export function endpoints(): Router {
    const router = new Router();

    router.get('/', use(new TestEndpoint())); //maybe show docs of openApi.yml?
    router.get('/rooms', use(new ShowRoomsEndpoint()));
    router.get('/buildings', use(new ShowBuildingsEndpoint()));
    router.get('/room-types', use(new ShowRoomTypesEndpoint()));
    router.get('/room-types/:roomTypeDocumentId',use(new ShowRoomTypeByDocumentIdEndpoint()));
    router.get('/device-data', use(new ShowDeviceDataEndpoint()));
    return router;
}
