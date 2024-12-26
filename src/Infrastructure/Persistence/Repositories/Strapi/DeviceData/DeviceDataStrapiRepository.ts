import { AirData, DeviceData, Optional } from "EnviroSense/Domain/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";
import { DeviceDataRepository } from "EnviroSense/Application/Contracts/mod.ts";

export class DeviceDataStrapiRepository
    extends StrapiQueryRepository
    implements DeviceDataRepository
{
    async find(deviceDataDocumentId: string): Promise<Optional<DeviceData>> {
        const endpoint = `device-datas/${deviceDataDocumentId.toString()}`;
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
        const endpoint = `device-datas/${deviceData.documentId}`;
        const body = this.mapFromDomain(deviceData);

        return await this.put(endpoint, { data: body });
    }

    async deleteEntity(deviceData: DeviceData): Promise<void> {
        console.log("getting devicedata inside the repo", deviceData);
        const endpoint = `device-datas/${deviceData.documentId}`; //ignore error works!
        console.log("endpoint", endpoint);

        return await this.delete(endpoint);
    }

    private mapToDomain(data: any): DeviceData {
        const airData: AirData = {
            temperature: data.temperature,
            humidity: data.humidity,
            ppm: data.gas_ppm,
        };

        const deviceData = DeviceData.load({
            documentId: data.documentId,
            device: data.device,
            timestamp: data.timestamp,
            airData: airData,
        });

        return deviceData;
    }

    private mapFromDomain(deviceData: DeviceData): any {
        return {
            device: deviceData.device
                ? { connect: [deviceData.device.documentId] }
                : null,
            timestamp: deviceData.timestamp,
            temperature: deviceData.airData.temperature,
            humidity: deviceData.airData.humidity,
            gas_ppm: deviceData.airData.ppm,
        };
    }
}
