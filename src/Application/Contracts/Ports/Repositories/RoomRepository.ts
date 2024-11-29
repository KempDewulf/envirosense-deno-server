import { Guid, Optional, Room } from "EnviroSense/Domain/mod.ts";

export interface RoomRepository {
    find(roomId: Guid): Promise<Optional<Room>>;
    save(room: Room): Promise<void>;
}
