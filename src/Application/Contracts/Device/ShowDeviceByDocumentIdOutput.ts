import { Room } from "EnviroSense/Domain/mod.ts";

export interface ShowDeviceByDocumentIdOutput {
	documentId: string;
	identifier: string;
	room: Room;
}
