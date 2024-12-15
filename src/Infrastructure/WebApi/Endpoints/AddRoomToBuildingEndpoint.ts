import { RouterContext } from '@oak/oak';
import {
    AddRoomToBuildingController,
    AddRoomToBuildingRequest,
    Endpoint,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { ErrorsBag } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { BuildingStrapiRepository, RoomTypeStrapiRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { AddRoomToBuilding } from 'EnviroSense/Application/mod.ts';

export class AddRoomToBuildingEndpoint implements Endpoint {
    private readonly _errors = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        const request = await this.buildRequest(context);

        this.validateRequest(request);

        if (this._errors.hasErrors) {
            context.response.status = 400;
            context.response.body = { errors: this._errors.errors };
            return;
        }

        const buildingRepository = new BuildingStrapiRepository();
        const roomTypeRepository = new RoomTypeStrapiRepository();
        const useCase = new AddRoomToBuilding(buildingRepository, roomTypeRepository);

        const controller = new AddRoomToBuildingController(useCase);
        await controller.handle(request);

        context.response.status = 201;
    }

    private async buildRequest(
        context: RouterContext<string>,
    ): Promise<AddRoomToBuildingRequest> {
        const { nameOfRoom, roomTypeDocumentId } = await context.request.body.json();
        const buildingDocumentId = context.params.buildingDocumentId;

        return {
            buildingDocumentId: buildingDocumentId,
            nameOfRoom,
            roomTypeDocumentId
        } as AddRoomToBuildingRequest;
    }

    private validateRequest(request: AddRoomToBuildingRequest): void {
        this._errors.clear();

        if (!request.buildingDocumentId) {
            this._errors.add('buildingDocumentId is required');
        }

        if (!request.nameOfRoom) {
            this._errors.add('nameOfRoom is required');
        }

        if (!request.roomTypeDocumentId) {
            this._errors.add('roomTypeDocumentId is required');
        }

        if (this._errors.hasErrors) {
            throw new Error('Invalid request');
        }
    }
}
