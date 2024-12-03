import { RoomRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { Optional, Room, Building, RoomType } from "EnviroSense/Domain/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";

export class RoomStrapiRepository extends StrapiQueryRepository implements RoomRepository {
    async find(roomId: string): Promise<Optional<Room>> {
        const endpoint = `rooms/${roomId.toString()}`;
        const params: Record<string, string> = {
            'populate[0]': 'building',
            'populate[1]': 'room_type.icon',
            'populate[2]': 'devices',
        };

        try {
            const response = await this.get<any>(endpoint, params);
            const room = this.mapToDomain(response.data);
            return Optional.of<Room>(room);
        } catch {
            return Optional.empty<Room>();
        }
    }

    async save(room: Room): Promise<void> {
        const endpoint = `rooms`;
        const body = this.mapFromDomain(room);

        return await this.post(endpoint, { data: body });
    }

    async update(room: Room): Promise<void> {
        const endpoint = `rooms/${room.id}`;
        const body = this.mapFromDomain(room);

        return await this.put(endpoint, { data: body });
    }

    async deleteEntity(room: Room): Promise<void> {
        const endpoint = `rooms/${room.id}`;

        return await this.delete(endpoint);
    }

    private mapToDomain(data: any): Room {
        const buildingData = data.building;
        const roomTypeData = data.room_type;

        const building = buildingData
            ? Building.load({
                id: buildingData.documentId,
                name: buildingData.name,
                address: buildingData.address,
            })
            : null;

        const roomType = roomTypeData
            ? RoomType.load({
                id: roomTypeData.documentId,
                name: roomTypeData.name,
                icon: roomTypeData.icon.name,
            })
            : null;

        const room = Room.load({
            id: data.documentId,
            name: data.name,
            building: building,
            roomType: roomType,
            devices: [],
        });

        return room;
    }

    private mapFromDomain(room: Room): any {
        return {
            "name": room.name,
            "building": room.building
                ? {
                    connect: [room.building.id], //for the scope of the project, we will hardcode it to the only existing building
                }
                : null,
            "room_type": room.roomType
                ? {
                    connect: [room.roomType.id],
                }
                : null,
            "devices": room.devices && room.devices.length > 0
                ? {
                    connect: room.devices.map((device) => device.id),
                }
                : [],
        };
    }
}