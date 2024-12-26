import { Building, Device, Optional, RoomType } from "EnviroSense/Domain/mod.ts";

export interface RoomQueryDto {
	documentId: string;
	documentId: string;
	name: string;
	building: Building;
	roomType: RoomType;
	devices: Device[];
}

export interface RoomQueryRepository {
	all(name: string): Promise<RoomQueryDto[]>;
	find(roomDocumentId: string): Promise<Optional<RoomQueryDto>>;
}
