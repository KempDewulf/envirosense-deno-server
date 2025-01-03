export type { UseCase } from "./Ports/UseCase.ts";
export type { OutputPort } from "./Ports/OutputPort.ts";

//Rooms
export type { ShowRoomsInput } from "./Room/ShowRoomsInput.ts";
export type { ShowRoomsOutput } from "./Room/ShowRoomsOutput.ts";

export type { CreateRoomInput } from "./Room/CreateRoomInput.ts";
export type { CreateRoomOutput } from "./Room/CreateRoomOutput.ts";

export type { ShowRoomByDocumentIdInput } from "./Room/ShowRoomByDocumentIdInput.ts";
export type { ShowRoomByDocumentIdOutput } from "./Room/ShowRoomByDocumentIdOutput.ts";

export type { ShowRoomAirQualityInput } from "./Room/ShowRoomAirQualityInput.ts";
export type { ShowRoomAirQualityOutput } from "./Room/ShowRoomAirQualityOutput.ts";

export type { RoomAirQualityOutput } from "./Room/RoomAirQualityOutput.ts";

export type { UpdateRoomInput } from "./Room/UpdateRoomInput.ts";
export type { UpdateRoomOutput } from "./Room/UpdateRoomOutput.ts";

export type { DeleteRoomInput } from "./Room/DeleteRoomInput.ts";

export type { AddDeviceToRoomInput } from "./Room/AddDeviceToRoomInput.ts";

export type { RemoveDeviceFromRoomInput } from "./Room/RemoveDeviceFromRoomInput.ts";

export type { RoomQueryDto, RoomQueryRepository } from "./Ports/Repositories/Room/RoomQueryRepository.ts";

export type { RoomRepository } from "./Ports/Repositories/Room/RoomRepository.ts";

//Buildings
export type { ShowBuildingsInput } from "./Building/ShowBuildingsInput.ts";
export type { ShowBuildingsOutput } from "./Building/ShowBuildingsOutput.ts";

export type { ShowBuildingAirQualityInput } from "./Building/ShowBuildingAirQualityInput.ts";
export type { ShowBuildingAirQualityOutput } from "./Building/ShowBuildingAirQualityOutput.ts";

export type { CreateBuildingInput } from "./Building/CreateBuildingInput.ts";
export type { CreateBuildingOutput } from "./Building/CreateBuildingOutput.ts";

export type { ShowBuildingByDocumentIdInput } from "./Building/ShowBuildingByDocumentIdInput.ts";
export type { ShowBuildingByDocumentIdOutput } from "./Building/ShowBuildingByDocumentIdOutput.ts";

export type { UpdateBuildingInput } from "./Building/UpdateBuildingInput.ts";
export type { UpdateBuildingOutput } from "./Building/UpdateBuildingOutput.ts";

export type { DeleteBuildingInput } from "./Building/DeleteBuildingInput.ts";

export type { AddRoomToBuildingInput } from "./Building/AddRoomToBuildingInput.ts";

export type { RemoveRoomFromBuildingInput } from "./Building/RemoveRoomFromBuildingInput.ts";

export type { BuildingQueryDto, BuildingQueryRepository } from "./Ports/Repositories/Building/BuildingQueryRepository.ts";

export type { BuildingRepository } from "./Ports/Repositories/Building/BuildingRepository.ts";

//Devices
export type { ShowDevicesInput } from "./Device/ShowDevicesInput.ts";
export type { ShowDevicesOutput } from "./Device/ShowDevicesOutput.ts";

export type { CreateDeviceInput } from "./Device/CreateDeviceInput.ts";
export type { CreateDeviceOutput } from "./Device/CreateDeviceOutput.ts";

export type { ShowDeviceByDocumentIdInput } from "./Device/ShowDeviceByDocumentIdInput.ts";
export type { ShowDeviceByDocumentIdOutput } from "./Device/ShowDeviceByDocumentIdOutput.ts";

export type { UpdateDeviceInput } from "./Device/UpdateDeviceInput.ts";
export type { UpdateDeviceOutput } from "./Device/UpdateDeviceOutput.ts";

export type { UpdateDeviceLimitInput } from "./Device/UpdateDeviceLimitInput.ts";
export type { UpdateDeviceLimitOutput } from "./Device/UpdateDeviceLimitOutput.ts";

export type { DeleteDeviceInput } from "./Device/DeleteDeviceInput.ts";

export type { DeleteAllDeviceDataFromDeviceInput } from "./Device/DeleteAllDeviceDataFromDeviceInput.ts";

export type { AddDeviceDataToDeviceInput } from "./Device/AddDeviceDataToDeviceInput.ts";

export type { DeviceQueryDto, DeviceQueryRepository } from "./Ports/Repositories/Device/DeviceQueryRepository.ts";

export type { DeviceRepository } from "./Ports/Repositories/Device/DeviceRepository.ts";

//RoomTypes
export type { ShowRoomTypesInput } from "./RoomType/ShowRoomTypesInput.ts";
export type { ShowRoomTypesOutput } from "./RoomType/ShowRoomTypesOutput.ts";

export type { CreateRoomTypeInput } from "./RoomType/CreateRoomTypeInput.ts";
export type { CreateRoomTypeOutput } from "./RoomType/CreateRoomTypeOutput.ts";

export type { ShowRoomTypeByDocumentIdInput } from "./RoomType/ShowRoomTypeByDocumentIdInput.ts";
export type { ShowRoomTypeByDocumentIdOutput } from "./RoomType/ShowRoomTypeByDocumentIdOutput.ts";

export type { UpdateRoomTypeInput } from "./RoomType/UpdateRoomTypeInput.ts";
export type { UpdateRoomTypeOutput } from "./RoomType/UpdateRoomTypeOutput.ts";

export type { DeleteRoomTypeInput } from "./RoomType/DeleteRoomTypeInput.ts";

export type { RoomTypeQueryDto, RoomTypeQueryRepository } from "./Ports/Repositories/RoomType/RoomTypeQueryRepository.ts";

export type { RoomTypeRepository } from "./Ports/Repositories/RoomType/RoomTypeRepository.ts";

//DeviceData
export type { ShowDeviceDataInput } from "./DeviceData/ShowDeviceDataInput.ts";
export type { ShowDeviceDataOutput } from "./DeviceData/ShowDeviceDataOutput.ts";

export type { ShowDeviceDataByDocumentIdInput } from "./DeviceData/ShowDeviceDataByDocumentIdInput.ts";
export type { ShowDeviceDataByDocumentIdOutput } from "./DeviceData/ShowDeviceDataByDocumentIdOutput.ts";

export type { ProcessDeviceDataInput } from "./DeviceData/ProcessDeviceDataInput.ts";
export type { ProcessDeviceDataOutput } from "./DeviceData/ProcessDeviceDataOutput.ts";

export type { DeviceDataQueryDto, DeviceDataQueryRepository } from "./Ports/Repositories/DeviceData/DeviceDataQueryRepository.ts";

export type { DeviceDataRepository } from "./Ports/Repositories/DeviceData/DeviceDataRepository.ts";
