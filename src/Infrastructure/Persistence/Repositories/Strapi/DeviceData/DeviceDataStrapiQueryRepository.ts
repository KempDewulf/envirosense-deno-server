import {
    DeviceDataQueryRepository,
    DeviceDataQueryAllDto,
} from "EnviroSense/Application/Contracts/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";

export class DeviceDataStrapiQueryRepository
    extends StrapiQueryRepository
    implements DeviceDataQueryRepository
{
    async all(identifier: string): Promise<DeviceDataQueryAllDto[]> {
        const endpoint = 'device-datas';
        //check if this really works like this since we need to filter on device its identifier probably - now we juts use device
        //probably some thing with this part: 'filters[device][$contains]' below
        const params = identifier ? { 'filters[device][identifier][$contains]': identifier, 'populate': '*' } : undefined;
        const response = await this.get<any>(endpoint, params);
        const deviceData = response.data.map((item: any) => this.mapToDto(item));
        return deviceData;
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
