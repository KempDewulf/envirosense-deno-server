import { RoomRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { Optional, Room, Guid } from "EnviroSense/Domain/mod.ts";
import { StrapiQueryRepository } from "../../Shared/StrapiQueryRepository.ts";

export class RoomStrapiRepository extends StrapiQueryRepository implements RoomRepository {
    constructor() {
        super('http://localhost:1331/api'); // Adjust the base URL as needed
    }

    async find(roomId: Guid): Promise<Optional<Room>> {
        const endpoint = `rooms/${roomId.toString()}`;
        try {
            const response = await this.get<any>(endpoint);
            const room = this.mapToDomain(response.data);
            return Optional.of<Room>(room);
        } catch {
            return Optional.empty<Room>();
        }
    }

    async save(room: Room): Promise<void> {
        const endpoint = `rooms/${room.id.toString()}`;
        const body = this.mapFromDomain(room);
        await this.put(endpoint, { data: body });
    }

    private mapToDomain(data: any): Room {
        const room = Room.load({
            id: Guid.create(data.id),
            name: data.attributes.name,
            building: data.attributes.building,
            roomType: data.attributes.roomType,
            devices: data.attributes.devices,
        });
        return room;
    }

    private mapFromDomain(room: Room): any {
        return {
            name: room.name,
            building: room.building.id.toString(),
            roomType: room.roomType.id.toString(),
            devices: (room.devices ?? []).map(device => device.id.toString()),
        };
    }
}