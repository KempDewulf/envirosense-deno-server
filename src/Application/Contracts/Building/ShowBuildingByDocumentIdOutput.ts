import { Room } from "EnviroSense/Domain/mod.ts";

export interface ShowBuildingByDocumentIdOutput {
	documentId: string;
	name: string;
	address: string;
	rooms: Room[];
}
