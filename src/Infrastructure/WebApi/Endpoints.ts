import { Router, RouterContext } from "@oak/oak";
import {
	AddDeviceDataToDeviceEndpoint,
	AddDeviceToRoomEndpoint,
	AddRoomToBuildingEndpoint,
	CreateBuildingEndpoint,
	CreateDeviceEndpoint,
	CreateRoomEndpoint,
	CreateRoomTypeEndpoint,
	DeleteAllDeviceDataFromDeviceEndpoint,
	DeleteBuildingEndpoint,
	DeleteDeviceEndpoint,
	DeleteRoomEndpoint,
	DeleteRoomTypeEndpoint,
	Endpoint,
	RemoveDeviceFromRoomEndpoint,
	RemoveRoomFromBuildingEndpoint,
	ShowBuildingAirQualityEndpoint,
	ShowBuildingByDocumentIdEndpoint,
	ShowBuildingsEndpoint,
	ShowDeviceByDocumentIdEndpoint,
	ShowDeviceDataByDocumentIdEndpoint,
	ShowDeviceDataEndpoint,
	ShowDevicesEndpoint,
	ShowOpenApiEndpoint,
	ShowRoomAirQualityEndpoint,
	ShowRoomByDocumentIdEndpoint,
	ShowRoomsEndpoint,
	ShowRoomTypeByDocumentIdEndpoint,
	ShowRoomTypesEndpoint,
	UpdateBuildingEndpoint,
	UpdateDeviceConfigEndpoint,
	UpdateDeviceEndpoint,
	UpdateDeviceLimitEndpoint,
	UpdateRoomEndpoint,
	UpdateRoomTypeEndpoint,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";

function use(endpoint: Endpoint) {
	return (context: RouterContext<string>) => endpoint.handle(context);
}

export function endpoints(): Router {
	const router = new Router();

	router.get("/", use(new ShowOpenApiEndpoint()));

	router.get("/buildings", use(new ShowBuildingsEndpoint()));
	router.get(
		"/buildings/:buildingDocumentId",
		use(new ShowBuildingByDocumentIdEndpoint()),
	);
	router.post("/buildings", use(new CreateBuildingEndpoint()));
	router.post(
		"/buildings/:buildingDocumentId/rooms",
		use(new AddRoomToBuildingEndpoint()),
	);
	router.delete(
		"/buildings/:buildingDocumentId",
		use(new DeleteBuildingEndpoint()),
	);
	router.delete(
		"/buildings/:buildingDocumentId/rooms/:roomDocumentId",
		use(new RemoveRoomFromBuildingEndpoint()),
	);
	router.get(
		"/buildings/:buildingDocumentId/air-quality",
		use(new ShowBuildingAirQualityEndpoint()),
	);
	router.put(
		"/buildings/:buildingDocumentId",
		use(new UpdateBuildingEndpoint()),
	);

	router.get("/rooms", use(new ShowRoomsEndpoint()));
	router.get(
		"/rooms/:roomDocumentId",
		use(new ShowRoomByDocumentIdEndpoint()),
	);
	router.get(
		"/rooms/:roomDocumentId/air-quality",
		use(new ShowRoomAirQualityEndpoint()),
	);
	router.post("/rooms", use(new CreateRoomEndpoint()));
	router.post(
		"/rooms/:roomDocumentId/devices",
		use(new AddDeviceToRoomEndpoint()),
	);
	router.delete("/rooms/:roomDocumentId", use(new DeleteRoomEndpoint()));
	router.delete(
		"/rooms/:roomDocumentId/devices/:deviceDocumentId",
		use(new RemoveDeviceFromRoomEndpoint()),
	);
	router.put("/rooms/:roomDocumentId", use(new UpdateRoomEndpoint()));

	router.get("/room-types", use(new ShowRoomTypesEndpoint()));
	router.get(
		"/room-types/:roomTypeDocumentId",
		use(new ShowRoomTypeByDocumentIdEndpoint()),
	);
	router.post("/room-types", use(new CreateRoomTypeEndpoint()));
	router.delete(
		"/room-types/:roomTypeDocumentId",
		use(new DeleteRoomTypeEndpoint()),
	);
	router.put(
		"/room-types/:roomTypeDocumentId",
		use(new UpdateRoomTypeEndpoint()),
	);

	router.get("/devices", use(new ShowDevicesEndpoint()));
	router.get(
		"/devices/:deviceDocumentId",
		use(new ShowDeviceByDocumentIdEndpoint()),
	);
	router.post("/devices", use(new CreateDeviceEndpoint()));
	router.post(
		"/devices/:deviceDocumentId/device-data",
		use(new AddDeviceDataToDeviceEndpoint()),
	);
	router.delete(
		"/devices/:deviceDocumentId",
		use(new DeleteDeviceEndpoint()),
	);
	router.delete(
		"/devices/:deviceDocumentId/device-data",
		use(new DeleteAllDeviceDataFromDeviceEndpoint()),
	);
	router.put("/devices/:deviceDocumentId", use(new UpdateDeviceEndpoint()));
	router.patch(
		"/devices/:deviceDocumentId/limits/:limitType",
		use(new UpdateDeviceLimitEndpoint()),
	);
	router.patch(
		"/devices/:deviceDocumentId/config/:configType",
		use(new UpdateDeviceConfigEndpoint()),
	);

	router.get("/device-data", use(new ShowDeviceDataEndpoint()));
	router.get(
		"/device-data/:deviceDataDocumentId",
		use(new ShowDeviceDataByDocumentIdEndpoint()),
	);

	return router;
}
