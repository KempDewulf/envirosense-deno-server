import {
    RoomQueryRepository,
    RoomQueryAllDto,
} from "EnviroSense/Application/Contracts/mod.ts";
import { StrapiQueryRepository } from "../../Shared/StrapiQueryRepository.ts";

export class RoomStrapiQueryRepository
    extends StrapiQueryRepository
    implements RoomQueryRepository
{
    constructor() {
        super('http://94.130.75.173:1331/api');
    }

    async all(name: string): Promise<RoomQueryAllDto[]> {
        const endpoint = 'rooms';
        const params = name ? { 'filters[name][$contains]': name } : undefined;
        const response = await this.get<any>(endpoint, params);
        const rooms = response.data.map((item: any) => this.mapToDto(item));
        return rooms;
    }

    private mapToDto(item: any): RoomQueryAllDto {
        return {
            id: item.id,
            name: item.name,
            building: item.building,
            room_type: item.room_type,
            devices: item.devices,
        };
    }
}