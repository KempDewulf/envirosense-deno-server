import { Building, Device, RoomType } from "EnviroSense/Domain/mod.ts";

export interface ShowRoomsOutput {
	id: string;
	documentId: string;
	name: string;
	building: Building;
	roomType: RoomType;
	devices: Device[];
}
