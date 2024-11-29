import { Device, Guid } from 'EnviroSense/Domain/mod.ts';

export interface DeviceData {
    id: Guid;
    device: Device;
    timestamp: Date;
    temperature: number;
    humidity: number;
    gasPpm: number;
}
