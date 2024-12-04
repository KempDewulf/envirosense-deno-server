import { Device } from 'EnviroSense/Domain/mod.ts';

export interface ShowDeviceDataOutput {
    id: string;
    documentId: string;
    device: Device;
    timestamp: number;
    temperature: number;
    humidity: number;
    gas_ppm: number;
}
