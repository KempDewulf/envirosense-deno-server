import { AirData, Device } from 'EnviroSense/Domain/mod.ts';

export interface ShowDeviceDataByDocumentIdOutput {
    id: string;
    documentId: string;
    device: Device;
    timestamp: Date;
    airData: AirData;
}
