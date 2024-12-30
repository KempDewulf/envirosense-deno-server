import { Optional, Room } from "EnviroSense/Domain/mod.ts";

export interface DeviceQueryDto {
	documentId: string;
	identifier: string;
	room: Room;
}

export interface DeviceQueryRepository {
	all(identifier: string): Promise<DeviceQueryDto[]>;
	find(deviceDocumentId: string): Promise<Optional<DeviceQueryDto>>;
}
