import { Room } from "EnviroSense/Domain/mod.ts";

export interface ShowDevicesOutput {
	documentId: string;
	identifier: string;
	room: Room;
}
