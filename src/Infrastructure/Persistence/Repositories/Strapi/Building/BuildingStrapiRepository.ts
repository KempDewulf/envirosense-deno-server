import { Building, Optional } from "EnviroSense/Domain/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";
import { BuildingRepository } from "EnviroSense/Application/Contracts/mod.ts";

export enum RoomOperation {
	ADD = "connect",
	REMOVE = "disconnect",
}

export class BuildingStrapiRepository extends StrapiQueryRepository implements BuildingRepository {
	async find(buildingDocumentId: string): Promise<Optional<Building>> {
		const endpoint = `buildings/${buildingDocumentId.toString()}`;
		const params: Record<string, string> = {};

		try {
			const response = await this.get<any>(endpoint, params);
			const building = this.mapToDomain(response.data);
			return Optional.of<Building>(building);
		} catch {
			return Optional.empty<Building>();
		}
	}

	async save(building: Building): Promise<void> {
		const endpoint = `buildings`;
		const body = this.mapFromDomain(building);

		return await this.post(endpoint, { data: body });
	}

	async update(building: Building): Promise<void> {
		const endpoint = `buildings/${building.id}`;
		const body = this.mapFromDomain(building);

		console.log(body);

		return await this.put(endpoint, { data: body });
	}

	async manageRooms(
		buildingDocumentId: string,
		roomDocumentIds: string[],
		operation: RoomOperation,
	) {
		const endpoint = `buildings/${buildingDocumentId}`;
		const body = {
			rooms: {
				[operation]: roomDocumentIds,
			},
		};
		await this.put(endpoint, { data: body });
	}

	async deleteEntity(building: Building): Promise<void> {
		const endpoint = `buildings/${building.id}`;

		return await this.delete(endpoint);
	}

	private mapToDomain(data: any): Building {
		const building = Building.load({
			id: data.documentId,
			name: data.name,
			address: data.address,
			rooms: data.rooms || [],
		});

		return building;
	}

	private mapFromDomain(building: Building): any {
		return {
			name: building.name,
			address: building.address,
			rooms: building.rooms && building.rooms.length > 0
				? {
					connect: building.rooms.map((room) => room.documentId), //ignore error, works
				}
				: [],
		};
	}
}
