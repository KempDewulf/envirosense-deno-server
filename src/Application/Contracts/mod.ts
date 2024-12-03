export type { UseCase } from "./Ports/UseCase.ts";
export type { OutputPort } from "./Ports/OutputPort.ts";

//Rooms
export type { ShowRoomsInput } from "./Room/ShowRoomsInput.ts";
export type { ShowRoomsOutput } from "./Room/ShowRoomsOutput.ts";

export type {
    RoomQueryAllDto,
    RoomQueryRepository,
} from "./Ports/Repositories/Room/RoomQueryRepository.ts";

export type { RoomRepository } from "./Ports/Repositories/Room/RoomRepository.ts";

//Buildings
export type { ShowBuildingsInput } from "./Room/ShowBuildingsInput.ts";
export type { ShowBuildingsOutput } from "./Room/ShowBuildingsOutput.ts";

export type {
    BuildingQueryAllDto,
    BuildingQueryRepository,
} from "./Ports/Repositories/Building/BuildingQueryRepository.ts";

export type { BuildingRepository } from "./Ports/Repositories/Building/BuildingRepository.ts";