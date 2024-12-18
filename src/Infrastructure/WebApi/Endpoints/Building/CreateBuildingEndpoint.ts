import { RouterContext } from "@oak/oak";
import {
	CreateBuildingController,
	CreateBuildingPresentedData,
	CreateBuildingPresenter,
	CreateBuildingRequest,
	Endpoint,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import {
	ErrorsBag,
	RequestResponse,
} from "EnviroSense/Infrastructure/Shared/mod.ts";

import { BuildingStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";

import { CreateBuilding } from "EnviroSense/Application/mod.ts";
import { BuildingRepository } from "EnviroSense/Application/Contracts/mod.ts";

export class CreateBuildingEndpoint implements Endpoint {
	private readonly _errorsBag = new ErrorsBag();

	async handle(context: RouterContext<string>): Promise<void> {
		const request = await this.buildRequest(context);

		this.validateRequest(request);

		if (this._errorsBag.hasErrors) {
			context.response.status = 400;
			context.response.body = { errors: this._errorsBag.errors };
			return;
		}

		const outputDevice = new RequestResponse<CreateBuildingPresentedData>();
		const presenter = new CreateBuildingPresenter(outputDevice);

		const repository: BuildingRepository = new BuildingStrapiRepository();

		const useCase = new CreateBuilding(
			presenter,
			repository,
		);

		const controller = new CreateBuildingController(useCase);

		await controller.handle(request);

		const response = outputDevice.response as CreateBuildingPresentedData;

		context.response.headers.set("Location", response.url);
		context.response.status = 201;
	}

	private async buildRequest(
		context: RouterContext<string>,
	): Promise<CreateBuildingRequest> {
		return await context.request.body.json() as CreateBuildingRequest;
	}

	private validateRequest(request: CreateBuildingRequest): void {
		this._errorsBag.clear();

		if (!request.name) {
			this._errorsBag.add("name is required.");
		}

		if (!request.address) {
			this._errorsBag.add("address is required.");
		}
	}
}
