import {
    DeviceDataQueryRepository,
    DeviceDataQueryAllDto,
} from "EnviroSense/Application/Contracts/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";
import { Optional } from 'EnviroSense/Domain/mod.ts';

export class DeviceDataStrapiQueryRepository
    extends StrapiQueryRepository
    implements DeviceDataQueryRepository
{
    async all(identifier: string): Promise<DeviceDataQueryAllDto[]> {
        const endpoint = 'device-datas';
        console.log(identifier)
        const params = identifier ? { 'filters[device][identifier][$contains]': identifier, 'populate': '*' } : undefined;
        const response = await this.get<any>(endpoint, params);
        const deviceData = response.data.map((item: any) => this.mapToDto(item));
        return deviceData;
    }

    async find(
        deviceDataDocumentId: string
    ): Promise<Optional<DeviceDataQueryAllDto>> {
        const endpoint = `device-datas/${deviceDataDocumentId.toString()}`;
        const params: Record<string, string> = {};

        const response = await this.get<any>(endpoint, params);

        const deviceData = this.mapToDto(response.data);

        return Optional.of<DeviceDataQueryAllDto>(deviceData);
    }

    private mapToDto(item: any): DeviceDataQueryAllDto {
        return {
            id: item.id,
            documentId: item.documentId,
            device: item.device,
            timestamp: item.timestamp,
            temperature: item.temperature,
            humidity: item.humidity,
            gas_ppm: item.gas_ppm,
        };
    }
}
