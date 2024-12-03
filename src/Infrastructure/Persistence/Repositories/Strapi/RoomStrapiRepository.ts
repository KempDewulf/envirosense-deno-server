import { RoomRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { Optional, Room, Guid, Building, RoomType } from "EnviroSense/Domain/mod.ts";
import { StrapiQueryRepository } from "../../Shared/StrapiQueryRepository.ts";

export class RoomStrapiRepository extends StrapiQueryRepository implements RoomRepository {
    constructor() {
        super('http://94.130.75.173:1331/api'); // Adjust the base URL as needed
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
        const endpoint = `rooms`;
        const body = this.mapFromDomain(room);
        console.log(body);

        return await this.post(endpoint, { data: body });
    }

    private mapToDomain(data: any): Room {
        const building = data.building
            ? Building.load({
                id: Guid.create(data.building.data.id),
                name: data.building.data.attributes.name,
                address: data.building.data.attributes.address,
            }) : null;

        const roomType = data['room-type']
            ? RoomType.load({
                id: Guid.create(data['room-type'].id),
                name: data['room-type'].attributes.name,
                icon: data['room-type'].attributes.icon,
            })
            : null;

        const room = Room.load({
            id: Guid.create(data.id),
            name: data.name,
            building: building,
            room_type: roomType,
            devices: data.devices,
        });

        return room;
    }

    private mapFromDomain(room: Room): any {
        return {
            name: room.name,
            building: room.building
                ? {
                    connect: [1],
                }
                : null,
            'room-type': room.roomType
                ? {
                    connect: [12],
                }
                : null,
            devices: room.devices && room.devices.length > 0
                ? {
                    connect: room.devices.map((device) => device.id),
                }
                : [],
        };
    }
}