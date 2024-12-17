import { AirData } from "EnviroSense/Domain/mod.ts";

export interface ProcessDeviceDataInput {
	deviceIdentifier: string;
	airData: AirData;
}
