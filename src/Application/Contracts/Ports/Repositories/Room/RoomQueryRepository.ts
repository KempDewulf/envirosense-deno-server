import { Building, Device, Optional, RoomType } from "EnviroSense/Domain/mod.ts";

export interface RoomQueryDto {
	id: string;
	documentId: string;
	name: string;
	building: Building;
	"room-type": RoomType;
	devices: Device[];
}

export interface RoomQueryRepository {
	all(name: string): Promise<RoomQueryDto[]>;
	find(roomDocumentId: string): Promise<Optional<RoomQueryDto>>;
}
