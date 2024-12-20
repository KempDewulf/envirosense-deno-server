import { AirData } from "EnviroSense/Domain/mod.ts";

export interface ShowRoomAirQualityOutput {
	id: string;
	enviroScore: number | null;
	airQuality: AirData;
}
