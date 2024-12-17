import { RouterContext } from "@oak/oak";
import {
	DeleteBuildingController,
	DeleteBuildingRequest,
	Endpoint,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag } from "EnviroSense/Infrastructure/Shared/mod.ts";

import { BuildingStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";

import { DeleteBuilding } from "EnviroSense/Application/mod.ts";
import { BuildingRepository } from "EnviroSense/Application/Contracts/mod.ts";

export class DeleteBuildingEndpoint implements Endpoint {
	private readonly _errorsBag = new ErrorsBag();

	async handle(context: RouterContext<string>): Promise<void> {
		const request = await this.buildRequest(context);

		this.validateRequest(request);

		if (this._errorsBag.hasErrors) {
			context.response.status = 400;
			context.response.body = { errors: this._errorsBag.errors };
			return;
		}

		const repository: BuildingRepository = new BuildingStrapiRepository();

		const useCase = new DeleteBuilding(repository);

		const controller = new DeleteBuildingController(useCase);

		await controller.handle(request);

		context.response.status = 204;
	}

	private buildRequest(
		context: RouterContext<string>,
	): DeleteBuildingRequest {
		const buildingDocumentId = context.params.buildingDocumentId || "";
		return { buildingDocumentId } as DeleteBuildingRequest;
	}

	private validateRequest(request: DeleteBuildingRequest): void {
		this._errorsBag.clear();

		if (!request.buildingDocumentId) {
			this._errorsBag.add("buildingDocumentId is required");
		}
	}
}
