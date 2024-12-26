import { AirData } from "EnviroSense/Domain/mod.ts";

export interface ShowRoomAirQualityOutput {
	documentId: string;
	enviroScore: number | null;
	airQuality: AirData;
}
