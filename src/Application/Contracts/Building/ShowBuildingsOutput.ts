import { Room } from "EnviroSense/Domain/mod.ts";

export interface ShowBuildingsOutput {
	documentId: string;
	name: string;
	address: string;
	rooms: Room[];
}
