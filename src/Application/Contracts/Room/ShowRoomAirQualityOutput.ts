import { AirData } from "EnviroSense/Domain/mod.ts";

export interface ShowRoomAirQualityOutput {
	id: string;
	enviroScore: string;
	airQuality: AirData;
}
