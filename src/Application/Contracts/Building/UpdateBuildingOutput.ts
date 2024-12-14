import { Room } from "EnviroSense/Domain/mod.ts";

export interface UpdateBuildingOutput {
    id: string;
    documentId: string;
    name: string;
    address: string;
    rooms: Room[];
}
