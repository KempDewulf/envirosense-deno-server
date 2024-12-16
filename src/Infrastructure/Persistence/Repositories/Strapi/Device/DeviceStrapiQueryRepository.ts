import {
    DeviceQueryRepository,
    DeviceQueryDto,
} from "EnviroSense/Application/Contracts/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";

export class DeviceStrapiQueryRepository
    extends StrapiQueryRepository
    implements DeviceQueryRepository
{
    async all(identifier: string): Promise<DeviceQueryDto[]> {
        const endpoint = "devices";
        const params = identifier
            ? { "filters[identifier][$contains]": identifier, populate: "*" }
            : undefined;
        const response = await this.get<any>(endpoint, params);

        const devices = response.data.map((item: any) => this.mapToDto(item));
        return devices;
    }

    private mapToDto(item: any): DeviceQueryDto {
        return {
            id: item.id,
            documentId: item.documentId,
            identifier: item.identifier,
            room: item.room,
            device_data: item.device_data,
        };
    }
}
