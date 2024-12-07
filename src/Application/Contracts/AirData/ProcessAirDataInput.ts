import { AirData } from "EnviroSense/Domain/mod.ts";

export interface ProcessAirDataInput {
    deviceIdentifier: string;
    airData: AirData;
}