import { RouterContext } from "@oak/oak";
import {
	Endpoint,
	ShowRoomTypesController,
	ShowRoomTypesPresentedData,
	ShowRoomTypesPresenter,
	ShowRoomTypesRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { RoomTypeStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { ShowRoomTypes } from "EnviroSense/Application/mod.ts";

export class ShowRoomTypesEndpoint implements Endpoint {
	async handle(context: RouterContext<string>): Promise<void> {
		const outputDevice = new RequestResponse<
			ShowRoomTypesPresentedData[]
		>();
		const presenter = new ShowRoomTypesPresenter(outputDevice);

		const repository = new RoomTypeStrapiQueryRepository();

		const useCase = new ShowRoomTypes(presenter, repository);

		const controller = new ShowRoomTypesController(useCase);
		const request = this.buildRequest(context);
		await controller.handle(request);

		context.response.headers.set("Content-Type", "application/json");
		context.response.body = outputDevice.response;

		return Promise.resolve();
	}

	static create(): Endpoint {
		return new ShowRoomTypesEndpoint();
	}

	private buildRequest(context: RouterContext<string>): ShowRoomTypesRequest {
		const name = context.request.url.searchParams.get("name")
			? context.request.url.searchParams.get("name")
			: "";

		return { name } as ShowRoomTypesRequest;
	}
}
