import {
    RoomQueryAllDto,
    RoomQueryRepository,
} from "EnviroSense/Application/Contracts/mod.ts";
import { StrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";

const BASE_URL = "http://localhost:1331/api/rooms";

export class RoomStrapiQueryRepository
    extends StrapiQueryRepository
    implements RoomQueryRepository
{
    constructor(baseUrl: string = BASE_URL) {
        super(baseUrl);
    }

    async all(name: string): Promise<RoomQueryAllDto[]> {
        const data: RoomQueryAllDto[] = await this.read<RoomQueryAllDto>(
            BASE_URL
        );

        if (name.trim() === "") {
            return data;
        }

        return data.filter((room) => room.name === name);
    }
}
