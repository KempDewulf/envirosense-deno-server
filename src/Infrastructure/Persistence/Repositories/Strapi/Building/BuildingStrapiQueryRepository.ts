import {
	BuildingQueryDto,
	BuildingQueryRepository,
} from "EnviroSense/Application/Contracts/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";
import { Optional } from "EnviroSense/Domain/mod.ts";

export class BuildingStrapiQueryRepository extends StrapiQueryRepository
	implements BuildingQueryRepository {
	async all(name: string): Promise<BuildingQueryDto[]> {
		const endpoint = "buildings";
		const params = name
			? { "filters[name][$contains]": name, populate: "*" }
			: undefined;
		const response = await this.get<any>(endpoint, params);

		const buildings = response.data.map((item: any) => this.mapToDto(item));
		return buildings;
	}

	async find(
		buildingDocumentId: string,
	): Promise<Optional<BuildingQueryDto>> {
		const endpoint = `buildings/${buildingDocumentId.toString()}`;
		const params: Record<string, string> = {};

		const response = await this.get<any>(endpoint, params);

		const building = this.mapToDto(response.data);

		return Optional.of<BuildingQueryDto>(building);
	}

	private mapToDto(item: any): BuildingQueryDto {
		return {
			id: item.id,
			documentId: item.documentId,
			name: item.name,
			address: item.address,
			rooms: item.rooms,
		};
	}
}
