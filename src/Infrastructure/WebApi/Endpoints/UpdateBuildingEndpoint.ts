import { RouterContext } from '@oak/oak';
import {
    UpdateBuildingController,
    UpdateBuildingPresentedData,
    UpdateBuildingPresenter,
    UpdateBuildingRequest,
    Endpoint,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { ErrorsBag, RequestResponse } from 'EnviroSense/Infrastructure/Shared/mod.ts';

import { BuildingStrapiRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';

import { UpdateBuilding } from 'EnviroSense/Application/mod.ts';
import { BuildingRepository } from 'EnviroSense/Application/Contracts/mod.ts';

export class UpdateBuildingEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        const request = await this.buildRequest(context);

        this.validateRequest(request);

        if (this._errorsBag.hasErrors) {
            context.response.status = 400;
            context.response.body = { errors: this._errorsBag.errors };
            return;
        }

        const outputDevice = new RequestResponse<UpdateBuildingPresentedData>();
        const presenter = new UpdateBuildingPresenter(outputDevice);

        const repository: BuildingRepository = new BuildingStrapiRepository();

        const useCase = new UpdateBuilding(
            presenter,
            repository
        );

        const controller = new UpdateBuildingController(useCase);

        await controller.handle(request);

        const response = outputDevice.response as UpdateBuildingPresentedData;

        context.response.status = 200;
        context.response.body = response;
    }

    private async buildRequest(context: RouterContext<string>): Promise<UpdateBuildingRequest> {
    const buildingDocumentId = context.params.buildingDocumentId || "";
    const body = context.request.hasBody
        ? await context.request.body.json()
        : {};

    return {
        buildingDocumentId,
        name: body.name,
        address: body.address,
        rooms: body.rooms,
    } as UpdateBuildingRequest;
}

    private validateRequest(request: UpdateBuildingRequest): void {
        this._errorsBag.clear();

        if (!request.buildingDocumentId) {
            this._errorsBag.add('buildingDocumentId is required');
        }

        if (request.name === undefined && request.address === undefined && request.rooms === undefined) {
            this._errorsBag.add('At least one of "name" or "address" or "rooms" must be provided');
        }
    }
}
