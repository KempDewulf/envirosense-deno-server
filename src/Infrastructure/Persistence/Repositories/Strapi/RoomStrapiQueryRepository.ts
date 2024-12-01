import {
    RoomQueryRepository,
    RoomQueryAllDto,
} from "EnviroSense/Application/Contracts/mod.ts";
import { StrapiQueryRepository } from "../../Shared/StrapiQueryRepository.ts";
import {
    Building,
    BuildingState,
    Device,
    DeviceState,
    RoomType,
    RoomTypeState,
    Guid,
} from "EnviroSense/Domain/mod.ts";

export class RoomStrapiQueryRepository
    extends StrapiQueryRepository
    implements RoomQueryRepository
{
    constructor() {
        super('http://localhost:1337/api'); // Adjust the base URL as needed
    }

    async all(name: string): Promise<RoomQueryAllDto[]> {
        const endpoint = 'rooms';
        const params = name ? { 'filters[name][$contains]': name } : undefined;
        const response = await this.get<any>(endpoint, params);
        const rooms = response.data.map((item: any) => this.mapToDto(item));
        return rooms;
    }

    private mapToDto(item: any): RoomQueryAllDto {
        // Build the BuildingState and load the Building instance
        const buildingData = item.attributes.building.data;
        const buildingState: BuildingState = {
            id: Guid.create(buildingData.id),
            name: buildingData.attributes.name,
            address: buildingData.attributes.address,
            rooms: [], // Populate if necessary
        };
        const building = Building.load(buildingState);

        // Build the RoomTypeState and load the RoomType instance
        const roomTypeData = item.attributes.roomType.data;
        const roomTypeState: RoomTypeState = {
            id: Guid.create(roomTypeData.id),
            name: roomTypeData.attributes.name,
            icon: roomTypeData.attributes.icon,
            rooms: [], // Populate if necessary
        };
        const roomType = RoomType.load(roomTypeState);

        // Build the devices array by loading each Device instance
        const devices = item.attributes.devices.data.map((deviceItem: any) => {
            const deviceState: DeviceState = {
                id: Guid.create(deviceItem.id),
                identifier: deviceItem.attributes.identifier,
                room: null, // Set if necessary
                deviceData: [], // Populate if necessary
            };
            return Device.load(deviceState);
        });

        return {
            id: item.id,
            name: item.attributes.name,
            building: building,
            roomType: roomType,
            devices: devices,
        };
    }
}