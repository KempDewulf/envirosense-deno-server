import { Optional, DeviceData } from "EnviroSense/Domain/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";
import { DeviceDataRepository } from "EnviroSense/Application/Contracts/mod.ts";

export class DeviceDataStrapiRepository
    extends StrapiQueryRepository
    implements DeviceDataRepository
{
    async find(deviceDataId: string): Promise<Optional<DeviceData>> {
        const endpoint = `device-datas/${deviceDataId.toString()}`;
        const params: Record<string, string> = {};

        try {
            const response = await this.get<any>(endpoint, params);
            const deviceData = this.mapToDomain(response.data);
            return Optional.of<DeviceData>(deviceData);
        } catch {
            return Optional.empty<DeviceData>();
        }
    }

    async save(deviceData: DeviceData): Promise<void> {
        const endpoint = `device-datas`;
        const body = this.mapFromDomain(deviceData);

        return await this.post(endpoint, { data: body });
    }

    async update(deviceData: DeviceData): Promise<void> {
        const endpoint = `device-datas/${deviceData.id}`;
        const body = this.mapFromDomain(deviceData);

        return await this.put(endpoint, { data: body });
    }

    async deleteEntity(deviceData: DeviceData): Promise<void> {
        const endpoint = `device-datas/${deviceData.id}`;

        return await this.delete(endpoint);
    }

    private mapToDomain(data: any): DeviceData {
        const deviceData = DeviceData.load({
            id: data.id,
            device: data.device,
            timestamp: data.timestamp,
            temperature: data.temperature,
            humidity: data.humidity,
            gasPpm: data.gas_ppm,
        });

        return deviceData;
    }

    private mapFromDomain(deviceData: DeviceData): any {
        return {
            device: deviceData.device,
            timestamp: deviceData.timestamp,
            temperature: deviceData.temperature,
            humidity: deviceData.humidity,
            gas_ppm: deviceData.gasPpm,
        };
    }
}
