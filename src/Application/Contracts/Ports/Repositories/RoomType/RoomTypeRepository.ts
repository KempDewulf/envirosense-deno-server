import { Optional, RoomType } from "EnviroSense/Domain/mod.ts";

export interface RoomTypeRepository {
    //make find return type promise optional roomtype or roomytypequerybydocumentiddto
    find(roomTypeId: string): Promise<Optional<RoomType>>;
    save(roomType: RoomType): Promise<void>;
}
