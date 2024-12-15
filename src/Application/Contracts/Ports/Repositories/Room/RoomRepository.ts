import { Optional, Room } from "EnviroSense/Domain/mod.ts";

export interface RoomRepository {
    find(roomDocumentId: string): Promise<Optional<Room>>;
    save(room: Room): Promise<void>;
    update(room: Room): Promise<void>;
    deleteEntity(room: Room): Promise<void>;
}
