import { RouterContext } from '@oak/oak';
import {
    RemoveRoomFromBuildingController,
    RemoveRoomFromBuildingRequest,
    Endpoint,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { ErrorsBag } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { BuildingStrapiRepository, RoomStrapiRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { RemoveRoomFromBuilding } from 'EnviroSense/Application/mod.ts';

export class RemoveRoomFromBuildingEndpoint implements Endpoint {
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
        const roomRepository = new RoomStrapiRepository();
        const useCase = new RemoveRoomFromBuilding(buildingRepository, roomRepository);

        const controller = new RemoveRoomFromBuildingController(useCase);
        await controller.handle(request);

        context.response.status = 201;
    }

    private async buildRequest(
        context: RouterContext<string>,
    ): Promise<RemoveRoomFromBuildingRequest> {
        const buildingDocumentId = context.params.buildingDocumentId;
        const roomDocumentId = context.params.roomDocumentId;

        return {
            buildingDocumentId: buildingDocumentId,
            roomDocumentId: roomDocumentId,
        } as RemoveRoomFromBuildingRequest;
    }

    private validateRequest(request: RemoveRoomFromBuildingRequest): void {
        this._errors.clear();

        if (!request.buildingDocumentId) {
            this._errors.add('buildingDocumentId is required');
        }

        if (!request.roomDocumentId) {
            this._errors.add('roomDocumentId is required');
        }
    }
}
