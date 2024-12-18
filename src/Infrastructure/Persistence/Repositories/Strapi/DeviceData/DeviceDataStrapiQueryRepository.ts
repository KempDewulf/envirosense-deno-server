import { DeviceDataQueryDto, DeviceDataQueryRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";
import { Optional } from "EnviroSense/Domain/mod.ts";

export class DeviceDataStrapiQueryRepository extends StrapiQueryRepository implements DeviceDataQueryRepository {
	async all(identifier: string): Promise<DeviceDataQueryDto[]> {
		const endpoint = "device-datas";
		const params = identifier
			? {
				"filters[device][identifier][$contains]": identifier,
				"populate": "*",
			}
			: undefined;
		const response = await this.get<any>(endpoint, params);
		const deviceData = response.data.map((item: any) => this.mapToDto(item));

		return deviceData;
	}

	async find(
		deviceDataDocumentId: string,
	): Promise<Optional<DeviceDataQueryDto>> {
		const endpoint = `device-datas/${deviceDataDocumentId.toString()}`;
		const params: Record<string, string> = {};

		const response = await this.get<any>(endpoint, params);

		const deviceData = this.mapToDto(response.data);

		return Optional.of<DeviceDataQueryDto>(deviceData);
	}

	private mapToDto(item: any): DeviceDataQueryDto {
		return {
			id: item.id,
			documentId: item.documentId,
			device: item.device,
			timestamp: item.timestamp,
			airData: {
				temperature: item.temperature,
				humidity: item.humidity,
				ppm: item.gas_ppm,
			},
		};
	}
}
