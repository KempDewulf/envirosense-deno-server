import { Router, RouterContext } from '@oak/oak';
import {
    Endpoint,
    CreateRoomTypeEndpoint,
    DeleteRoomTypeEndpoint,
    ShowRoomTypeByDocumentIdEndpoint,
    ShowRoomTypesEndpoint,
    UpdateRoomTypeEndpoint,
    ShowBuildingsEndpoint,
    CreateBuildingEndpoint,
    DeleteBuildingEndpoint,
    ShowBuildingByDocumentIdEndpoint,
    UpdateBuildingEndpoint,
    AddRoomToBuildingEndpoint,
    RemoveRoomFromBuildingEndpoint,
    ShowDeviceDataEndpoint,
    ShowDeviceDataByDocumentIdEndpoint,
    ShowOpenApiEndpoint,
    ShowRoomsEndpoint,
    CreateRoomEndpoint,
    ShowRoomByDocumentIdEndpoint,
    AddDeviceToRoomEndpoint,
    DeleteRoomEndpoint,
    RemoveDeviceFromRoomEndpoint,
    UpdateRoomEndpoint,
    ShowDevicesEndpoint,
    CreateDeviceEndpoint,
    ShowDeviceByDocumentIdEndpoint,
    AddDeviceDataToDeviceEndpoint,
    DeleteDeviceEndpoint,
    UpdateDeviceEndpoint,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';

function use(endpoint: Endpoint) {
    return (context: RouterContext<string>) => endpoint.handle(context);
}

export function endpoints(): Router {
    const router = new Router();

    router.get('/', use(new ShowOpenApiEndpoint()));

    router.get('/buildings', use(new ShowBuildingsEndpoint()));
    router.get('/buildings/:buildingDocumentId', use(new ShowBuildingByDocumentIdEndpoint()));
    router.post('/buildings', use(new CreateBuildingEndpoint()));
    router.post('/buildings/:buildingDocumentId/rooms', use(new AddRoomToBuildingEndpoint()));
    router.delete('/buildings/:buildingDocumentId', use(new DeleteBuildingEndpoint()));
    router.delete('/buildings/:buildingDocumentId/rooms/:roomDocumentId', use(new RemoveRoomFromBuildingEndpoint()));
    router.put('/buildings/:buildingDocumentId', use(new UpdateBuildingEndpoint()));

    router.get('/rooms', use(new ShowRoomsEndpoint()));
    router.get('/rooms/:roomDocumentId', use(new ShowRoomByDocumentIdEndpoint()));
    router.post('/rooms', use(new CreateRoomEndpoint()));
    router.post('/rooms/:roomDocumentId/devices', use(new AddDeviceToRoomEndpoint()));
    router.delete('/rooms/:roomDocumentId', use(new DeleteRoomEndpoint()));
    router.delete('/rooms/:roomDocumentId/devices/:deviceDocumentId', use(new RemoveDeviceFromRoomEndpoint()));
    router.put('/rooms/:roomDocumentId', use(new UpdateRoomEndpoint()));

    router.get('/room-types', use(new ShowRoomTypesEndpoint()));
    router.get('/room-types/:roomTypeDocumentId', use(new ShowRoomTypeByDocumentIdEndpoint()));
    router.post('/room-types', use(new CreateRoomTypeEndpoint()));
    router.delete('/room-types/:roomTypeDocumentId', use(new DeleteRoomTypeEndpoint()));
    router.put('/room-types/:roomTypeDocumentId', use(new UpdateRoomTypeEndpoint()));

    router.get('/devices', use(new ShowDevicesEndpoint()));
    router.get('/devices/:deviceDocumentId', use(new ShowDeviceByDocumentIdEndpoint()));
    router.post('/devices', use(new CreateDeviceEndpoint()));
    router.post('/devices/:deviceDocumentId/device-data', use(new AddDeviceDataToDeviceEndpoint()));
    router.delete('/devices/:deviceDocumentId', use(new DeleteDeviceEndpoint()));
    router.put('/devices/:deviceDocumentId', use(new UpdateDeviceEndpoint()));

    router.get('/device-data', use(new ShowDeviceDataEndpoint()));
    router.get('/device-data/:deviceDataDocumentId', use(new ShowDeviceDataByDocumentIdEndpoint()));

    return router;
}
