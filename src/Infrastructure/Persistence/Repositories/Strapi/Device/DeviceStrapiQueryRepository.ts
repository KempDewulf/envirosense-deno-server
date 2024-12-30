import { DeviceQueryDto, DeviceQueryRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";
import { Optional } from "EnviroSense/Domain/mod.ts";

export class DeviceStrapiQueryRepository extends StrapiQueryRepository implements DeviceQueryRepository {
	async all(identifier: string): Promise<DeviceQueryDto[]> {
		const endpoint = "devices";
		const params = identifier ? { "filters[identifier][$contains]": identifier, populate: "*" } : undefined;
		const response = await this.get<any>(endpoint, params);

		const devices = response.data.map((item: any) => this.mapToDto(item));
		return devices;
	}

	async find(deviceDocumentId: string): Promise<Optional<DeviceQueryDto>> {
		const endpoint = `devices/${deviceDocumentId.toString()}`;
		const params: Record<string, string> = {};

		const response = await this.get<any>(endpoint, params);

		const device = this.mapToDto(response.data);

		return Optional.of<DeviceQueryDto>(device);
	}

	private mapToDto(item: any): DeviceQueryDto {
		return {
			documentId: item.documentId,
			identifier: item.identifier,
			room: item.room
		};
	}
}
