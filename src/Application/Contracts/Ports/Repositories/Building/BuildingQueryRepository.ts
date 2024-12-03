export interface BuildingQueryAllDto {
    id: string;
    name: string;
    address: string;
}

export interface BuildingQueryRepository {
    all(name: string): Promise<BuildingQueryAllDto[]>;
}
