import { RoomAirQualityOutput } from "EnviroSense/Application/Contracts/mod.ts";

export interface ShowBuildingAirQualityOutput {
	id: string;
	enviroScore: number | null;
	rooms: RoomAirQualityOutput[];
}
