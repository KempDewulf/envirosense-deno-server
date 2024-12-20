import { DeviceData } from "EnviroSense/Domain/mod.ts";

export function sortDeviceDataDesc(deviceData: DeviceData[]): DeviceData[] {
    return deviceData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}