import { RoomQueryDto, RoomQueryRepository } from 'EnviroSense/Application/Contracts/mod.ts';
import { StrapiQueryRepository } from '../../../Shared/StrapiQueryRepository.ts';
import { Optional } from 'EnviroSense/Domain/mod.ts';

export class RoomStrapiQueryRepository extends StrapiQueryRepository
    implements RoomQueryRepository {
    async all(name: string): Promise<RoomQueryDto[]> {
        const endpoint = 'rooms';
        const params = name ? { 'filters[name][$contains]': name, populate: '*' } : undefined;
        const response = await this.get<any>(endpoint, params);

        const rooms = response.data.map((item: any) => this.mapToDto(item));
        return rooms;
    }

    async find(
        roomDocumentId: string,
    ): Promise<Optional<RoomQueryDto>> {
        const endpoint = `rooms/${roomDocumentId.toString()}`;
        const params: Record<string, string> = {};

        const response = await this.get<any>(endpoint, params);

        const room = this.mapToDto(response.data);

        return Optional.of<RoomQueryDto>(room);
    }

    private mapToDto(item: any): RoomQueryDto {
        return {
            id: item.id,
            documentId: item.documentId,
            name: item.name,
            building: item.building,
            'room-type': item['room_type'],
            devices: item.devices,
        };
    }
}
