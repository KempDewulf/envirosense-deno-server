import { RouterContext } from "@oak/oak";
import {
	Endpoint,
	ShowBuildingAirQualityController,
	ShowBuildingAirQualityPresentedData,
	ShowBuildingAirQualityPresenter,
	ShowBuildingAirQualityRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { DeviceStrapiQueryRepository, BuildingStrapiQueryRepository, RoomStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { AirQualityCalculator } from "EnviroSense/Infrastructure/Services/AirQualityCalculator.ts";
import { ShowBuildingAirQuality } from "EnviroSense/Application/mod.ts";

export class ShowBuildingAirQualityEndpoint implements Endpoint {
	async handle(context: RouterContext<string>): Promise<void> {
		const outputDevice = new RequestResponse<
			ShowBuildingAirQualityPresentedData
		>();
		const presenter = new ShowBuildingAirQualityPresenter(outputDevice);

		const repository = new BuildingStrapiQueryRepository();
		const deviceRepository = new DeviceStrapiQueryRepository();
		const roomRepository = new RoomStrapiQueryRepository();
		
		const enviroScoreCalculator = new AirQualityCalculator(
			deviceRepository,
			roomRepository
		);

		const useCase = new ShowBuildingAirQuality(
			presenter,
			repository,
			enviroScoreCalculator,
		);

		const controller = new ShowBuildingAirQualityController(useCase);
		const request = this.buildRequest(context);
		await controller.handle(request);

		context.response.headers.set("Content-Type", "application/json");
		context.response.body = outputDevice.response;

		return Promise.resolve();
	}

	static create(): Endpoint {
		return new ShowBuildingAirQualityEndpoint();
	}

	private buildRequest(
		context: RouterContext<string>,
	): ShowBuildingAirQualityRequest {
		const buildingDocumentId = context.params.buildingDocumentId || "";

		return { buildingDocumentId } as ShowBuildingAirQualityRequest;
	}
}
