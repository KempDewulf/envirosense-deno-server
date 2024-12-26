import { RoomRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { Building, Device, Optional, Room, RoomType } from "EnviroSense/Domain/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";

export enum DeviceOperation {
	ADD = "connect",
	REMOVE = "disconnect",
}

export class RoomStrapiRepository extends StrapiQueryRepository implements RoomRepository {
	async find(roomDocumentId: string): Promise<Optional<Room>> {
		const endpoint = `rooms/${roomDocumentId.toString()}`;
		const params: Record<string, string> = {
			"populate[0]": "building",
			"populate[1]": "room_type.icon",
			"populate[2]": "devices",
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
		const endpoint = `rooms/${room.documentId}`;
		const body = this.mapFromDomain(room);

		return await this.put(endpoint, { data: body });
	}

	async manageDevices(
		roomDocumentId: string,
		deviceDocumentIds: string[],
		operation: DeviceOperation,
	) {
		const endpoint = `rooms/${roomDocumentId}`;
		const body = {
			devices: {
				[operation]: deviceDocumentIds,
			},
		};
		await this.put(endpoint, { data: body });
	}

	async deleteEntity(room: Room): Promise<void> {
		const endpoint = `rooms/${room.documentId}`;

		return await this.delete(endpoint);
	}

	private mapToDomain(data: any): Room {
		const buildingData = data?.building;
		const roomTypeData = data.room_type;
		const devicesData = data.devices;

		const building = buildingData
			? Building.load({
				documentId: buildingData.documentId,
				name: buildingData.name,
				address: buildingData.address,
			})
			: null;

		const roomType = RoomType.load({
			documentId: roomTypeData.documentId,
			name: roomTypeData.name,
			icon: roomTypeData.icon,
		});

		const devices = devicesData.map((device: any) => {
			return Device.load({
				documentId: device.documentId,
				identifier: device.identifier,
			});
		});

		const room = Room.load({
			documentId: data.documentId,
			name: data.name,
			building: building,
			roomType: roomType,
			devices: devices,
		});

		return room;
	}

	private mapFromDomain(room: Room): any {
		return {
			name: room.name,
			building: room.building
				? {
					connect: [room.building.documentId],
				}
				: null,
			room_type: room.roomType
				? {
					connect: [room.roomType.documentId],
				}
				: null,
			devices: room.devices && room.devices.length > 0
				? {
					connect: room.devices.map(
						(device) => device.documentId,
					),
				}
				: [],
		};
	}
}
