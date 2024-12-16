import { Optional, Room } from "EnviroSense/Domain/mod.ts";
import { DeviceOperation } from 'EnviroSense/Infrastructure/Persistence/Repositories/Strapi/Room/RoomStrapiRepository.ts';

export interface RoomRepository {
    find(roomDocumentId: string): Promise<Optional<Room>>;
    save(room: Room): Promise<void>;
    update(room: Room): Promise<void>;
    deleteEntity(room: Room): Promise<void>;
    manageDevices(roomDocumentId: string, deviceDocumentIds: string[], operation: DeviceOperation): Promise<void>;
}
