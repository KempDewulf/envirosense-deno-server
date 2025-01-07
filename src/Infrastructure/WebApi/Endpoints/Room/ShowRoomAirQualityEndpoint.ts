import { RouterContext } from "@oak/oak";
import {
	Endpoint,
	ShowRoomAirQualityController,
	ShowRoomAirQualityPresentedData,
	ShowRoomAirQualityPresenter,
	ShowRoomAirQualityRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
	DeviceDataStrapiQueryRepository,
	DeviceStrapiQueryRepository,
	RoomStrapiQueryRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { ShowRoomAirQuality } from "EnviroSense/Application/mod.ts";
import { AirQualityCalculator } from "EnviroSense/Infrastructure/Services/mod.ts";

export class ShowRoomAirQualityEndpoint implements Endpoint {
	async handle(context: RouterContext<string>): Promise<void> {
		const outputDevice = new RequestResponse<
			ShowRoomAirQualityPresentedData
		>();
		const presenter = new ShowRoomAirQualityPresenter(outputDevice);

		const repository = new RoomStrapiQueryRepository();
		const deviceRepository = new DeviceStrapiQueryRepository();
		const deviceDataRepository = new DeviceDataStrapiQueryRepository();

		const enviroScoreCalculator = new AirQualityCalculator(
			deviceRepository,
			deviceDataRepository,
		);

		const useCase = new ShowRoomAirQuality(
			presenter,
			repository,
			enviroScoreCalculator,
		);

		const controller = new ShowRoomAirQualityController(useCase);
		const request = this.buildRequest(context);
		await controller.handle(request);

		context.response.headers.set("Content-Type", "application/json");
		context.response.body = outputDevice.response;

		return Promise.resolve();
	}

	static create(): Endpoint {
		return new ShowRoomAirQualityEndpoint();
	}

	private buildRequest(
		context: RouterContext<string>,
	): ShowRoomAirQualityRequest {
		const roomDocumentId = context.params.roomDocumentId || "";

		return { roomDocumentId } as ShowRoomAirQualityRequest;
	}
}
