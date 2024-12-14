import { Router, RouterContext } from '@oak/oak';
import {
    CreateRoomTypeEndpoint,
    DeleteRoomTypeEndpoint,
    Endpoint,
    ShowBuildingsEndpoint,
    CreateBuildingEndpoint,
    DeleteBuildingEndpoint,
    ShowBuildingByDocumentIdEndpoint,
    UpdateBuildingEndpoint,
    ShowDeviceDataEndpoint,
    ShowOpenApiEndpoint,
    ShowRoomsEndpoint,
    ShowRoomTypeByDocumentIdEndpoint,
    ShowRoomTypesEndpoint,
    UpdateRoomTypeEndpoint,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';

function use(endpoint: Endpoint) {
    return (context: RouterContext<string>) => endpoint.handle(context);
}

export function endpoints(): Router {
    const router = new Router();

    router.get('/', use(new ShowOpenApiEndpoint()));
    router.get('/rooms', use(new ShowRoomsEndpoint()));

    router.get('/buildings', use(new ShowBuildingsEndpoint()));
    router.post('/buildings', use(new CreateBuildingEndpoint()));
    router.get('/buildings/:buildingDocumentId', use(new ShowBuildingByDocumentIdEndpoint()));
    router.delete('/buildings/:buildingDocumentId', use(new DeleteBuildingEndpoint()));
    router.put('/buildings/:buildingDocumentId', use(new UpdateBuildingEndpoint()));

    router.get('/room-types', use(new ShowRoomTypesEndpoint()));
    router.post('/room-types', use(new CreateRoomTypeEndpoint()));
    router.get('/room-types/:roomTypeDocumentId', use(new ShowRoomTypeByDocumentIdEndpoint()));
    router.delete('/room-types/:roomTypeDocumentId', use(new DeleteRoomTypeEndpoint()));
    router.put('/room-types/:roomTypeDocumentId', use(new UpdateRoomTypeEndpoint()));

    router.get('/device-data', use(new ShowDeviceDataEndpoint()));
    return router;
}
