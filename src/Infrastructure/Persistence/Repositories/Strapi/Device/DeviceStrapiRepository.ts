import { Optional, Device } from "EnviroSense/Domain/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";
import { DeviceRepository } from "EnviroSense/Application/Contracts/mod.ts";

export class DeviceStrapiRepository
    extends StrapiQueryRepository
    implements DeviceRepository
{
    async find(deviceId: string): Promise<Optional<Device>> {
        const endpoint = `devices/${deviceId.toString()}`;
        const params: Record<string, string> = {};

        try {
            const response = await this.get<any>(endpoint, params);
            const device = this.mapToDomain(response.data);
            return Optional.of<Device>(device);
        } catch {
            return Optional.empty<Device>();
        }
    }

    async findByIdentifier(identifier: string): Promise<Optional<Device>> {
        const endpoint = `devices`;
        const params = { 'filters[identifier][$eq]': identifier, 'populate': '*' };

        try {
            const response = await this.get<any>(endpoint, params);
            if (response.data.length === 0) {
                return Optional.empty<Device>();
            }
            const device = this.mapToDomain(response.data[0]);
            return Optional.of<Device>(device);
        } catch {
            return Optional.empty<Device>();
        }
    }

    async save(device: Device): Promise<void> {
        const endpoint = `devices`;
        const body = this.mapFromDomain(device);

        return await this.post(endpoint, { data: body });
    }

    async update(device: Device): Promise<void> {
        const endpoint = `devices/${device.id}`;
        const body = this.mapFromDomain(device);

        return await this.put(endpoint, { data: body });
    }

    async deleteEntity(device: Device): Promise<void> {
        const endpoint = `devices/${device.id}`;

        return await this.delete(endpoint);
    }

    private mapToDomain(data: any): Device {
        const device = Device.load({
            id: data.documentId,
            identifier: data.identifier,
            room: data.room,
            deviceData: data.deviceData,
        });

        return device;
    }

    private mapFromDomain(device: Device): any {
        return {
            identifier: device.identifier,
            room: device.room,
            device_data: device.deviceData,
        };
    }
}
