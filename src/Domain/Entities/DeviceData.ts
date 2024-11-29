import { Device } from 'EnviroSense/Domain/mod.ts';

export interface DeviceData {
    id: string;
    device: Device;
    timestamp: Date;
    temperature: number;
    humidity: number;
    gasPpm: number;
}
