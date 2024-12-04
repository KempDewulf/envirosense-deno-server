import {
    RoomTypeQueryRepository,
    RoomTypeQueryAllDto,
} from "EnviroSense/Application/Contracts/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";-

export class RoomTypeStrapiQueryRepository
    extends StrapiQueryRepository
    implements RoomTypeQueryRepository
{
    async all(name: string): Promise<RoomTypeQueryAllDto[]> {
        const endpoint = "room-types";
        const params = name
            ? { "filters[name][$contains]": name, populate: "*" }
            : undefined;
        const response = await this.get<any>(endpoint, params);

        const roomTypes = response.data.map((item: any) => this.mapToDto(item));
        return roomTypes;
    }

    private mapToDto(item: any): RoomTypeQueryAllDto {
        return {
            id: item.id,
            documentId: item.documentId,
            name: item.name,
            icon: item.icon,
            rooms: item.rooms,
        };
    }
}
