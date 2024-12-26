import { RoomAirQualityOutput } from "EnviroSense/Application/Contracts/mod.ts";

export interface ShowBuildingAirQualityOutput {
    documentId: string;
    enviroScore: number | null;
    rooms: RoomAirQualityOutput[];
}
