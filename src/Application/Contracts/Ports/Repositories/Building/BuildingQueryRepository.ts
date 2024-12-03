import { Room } from 'EnviroSense/Domain/mod.ts';

export interface BuildingQueryAllDto {
    id: string;
    documentId: string;
    name: string;
    address: string;
    rooms: Room[];
}

export interface BuildingQueryRepository {
    all(name: string): Promise<BuildingQueryAllDto[]>;
}
