import { RouterContext } from "@oak/oak";
import {
	Endpoint,
	ShowBuildingsController,
	ShowBuildingsPresentedData,
	ShowBuildingsPresenter,
	ShowBuildingsRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { BuildingStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { ShowBuildings } from "EnviroSense/Application/mod.ts";

export class ShowBuildingsEndpoint implements Endpoint {
	async handle(context: RouterContext<string>): Promise<void> {
		const outputDevice = new RequestResponse<
			ShowBuildingsPresentedData[]
		>();
		const presenter = new ShowBuildingsPresenter(outputDevice);

		const repository = new BuildingStrapiQueryRepository();

		const useCase = new ShowBuildings(presenter, repository);

		const controller = new ShowBuildingsController(useCase);
		const request = this.buildRequest(context);
		await controller.handle(request);

		context.response.headers.set("Content-Type", "application/json");
		context.response.body = outputDevice.response;

		return Promise.resolve();
	}

	static create(): Endpoint {
		return new ShowBuildingsEndpoint();
	}

	private buildRequest(context: RouterContext<string>): ShowBuildingsRequest {
		const name = context.request.url.searchParams.get("name") ? context.request.url.searchParams.get("name") : "";

		return { name } as ShowBuildingsRequest;
	}
}
