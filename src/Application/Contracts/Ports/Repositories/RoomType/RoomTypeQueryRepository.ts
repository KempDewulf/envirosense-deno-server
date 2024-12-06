import { Optional, Room } from "EnviroSense/Domain/mod.ts";

export interface RoomTypeQueryDto {
    id: string;
    documentId: string;
    name: string;
    icon: string;
    rooms: Room[];
}

export interface RoomTypeQueryRepository {
    all(name: string): Promise<RoomTypeQueryDto[]>;
    find(roomTypeDocumentId: string): Promise<Optional<RoomTypeQueryDto>>
}
