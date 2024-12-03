import {
    BuildingQueryRepository,
    BuildingQueryAllDto,
} from "EnviroSense/Application/Contracts/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";

export class BuildingStrapiQueryRepository
    extends StrapiQueryRepository
    implements BuildingQueryRepository
{
    async all(name: string): Promise<BuildingQueryAllDto[]> {
        const endpoint = 'buildings';
        const params = name ? { 'filters[name][$contains]': name, 'populate': '*' } : undefined;
        const response = await this.get<any>(endpoint, params);

        const buildings = response.data.map((item: any) => this.mapToDto(item));
        return buildings;
    }

    private mapToDto(item: any): BuildingQueryAllDto {
        return {
            id: item.id,
            documentId: item.documentId,
            name: item.name,
            address: item.address
        };
    }
}