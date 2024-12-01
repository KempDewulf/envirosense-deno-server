export interface RoomQueryAllDto {
    id: string;
    name: string;
}

export interface RoomQueryRepository {
    all(name: string): Promise<RoomQueryAllDto[]>;
}
