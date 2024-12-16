import { Building, Device, RoomType } from "EnviroSense/Domain/mod.ts";

export interface ShowBuildingByDocumentIdOutput {
    id: string;
    documentId: string;
    name: string;
    building: Building;
    'room-type': RoomType;
    devices: Device[];
}
