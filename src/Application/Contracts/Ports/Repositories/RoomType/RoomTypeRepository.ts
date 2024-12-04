import { Optional, RoomType } from "EnviroSense/Domain/mod.ts";

export interface RoomTypeRepository {
    find(roomTypeId: string): Promise<Optional<RoomType>>;
    save(roomType: RoomType): Promise<void>;
}
