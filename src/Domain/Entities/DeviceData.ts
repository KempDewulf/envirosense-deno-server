import { Device } from './Device.ts';

export interface DeviceDataState {
    id: string;
    device: Device;
    timestamp: Date;
    temperature: number;
    humidity: number;
    gasPpm: number;
}
