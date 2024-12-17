import { RouterContext } from '@oak/oak';
import {
    AddRoomToBuildingController,
    AddRoomToBuildingRequest,
    Endpoint,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { ErrorsBag } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import {
    BuildingStrapiRepository,
    RoomStrapiRepository,
} from 'EnviroSense/Infrastructure/Persistence/mod.ts';
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
        const roomRepository = new RoomStrapiRepository();
        const useCase = new AddRoomToBuilding(buildingRepository, roomRepository);

        const controller = new AddRoomToBuildingController(useCase);
        await controller.handle(request);

        context.response.status = 201;
    }

    private async buildRequest(
        context: RouterContext<string>,
    ): Promise<AddRoomToBuildingRequest> {
        const { rooms } = await context.request.body.json();
        const buildingDocumentId = context.params.buildingDocumentId;

        return {
            buildingDocumentId: buildingDocumentId,
            rooms: rooms,
        } as AddRoomToBuildingRequest;
    }

    private validateRequest(request: AddRoomToBuildingRequest): void {
        this._errors.clear();

        if (!request.buildingDocumentId) {
            this._errors.add('buildingDocumentId is required');
        }

        if (!request.rooms || request.rooms.length === 0) {
            this._errors.add(
                'rooms is required. It must be an array of strings (the documentIds of the room)',
            );
        }
    }
}
