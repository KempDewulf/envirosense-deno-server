import { RouterContext } from '@oak/oak';
import {
    CreateRoomController,
    CreateRoomPresentedData,
    CreateRoomPresenter,
    CreateRoomRequest,
    Endpoint,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { ErrorsBag, RequestResponse } from 'EnviroSense/Infrastructure/Shared/mod.ts';

import {
    BuildingStrapiRepository,
    RoomStrapiRepository,
    RoomTypeStrapiRepository,
} from 'EnviroSense/Infrastructure/Persistence/mod.ts';

import { CreateRoom } from 'EnviroSense/Application/mod.ts';
import {
    BuildingRepository,
    RoomRepository,
    RoomTypeRepository,
} from 'EnviroSense/Application/Contracts/mod.ts';

export class CreateRoomEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        const request = await this.buildRequest(context);

        this.validateRequest(request);

        if (this._errorsBag.hasErrors) {
            context.response.status = 400;
            context.response.body = { errors: this._errorsBag.errors };
            return;
        }

        const outputDevice = new RequestResponse<CreateRoomPresentedData>();
        const presenter = new CreateRoomPresenter(outputDevice);

        const roomRepository: RoomRepository = new RoomStrapiRepository();
        const buildingRepository: BuildingRepository = new BuildingStrapiRepository();
        const roomTypeRepository: RoomTypeRepository = new RoomTypeStrapiRepository();

        const useCase = new CreateRoom(
            presenter,
            roomRepository,
            buildingRepository,
            roomTypeRepository,
        );

        const controller = new CreateRoomController(useCase);

        await controller.handle(request);

        const response = outputDevice.response as CreateRoomPresentedData;

        context.response.headers.set('Location', response.url);
        context.response.status = 201;
    }

    private async buildRequest(context: RouterContext<string>): Promise<CreateRoomRequest> {
        return await context.request.body.json() as CreateRoomRequest;
    }

    private validateRequest(request: CreateRoomRequest): void {
        this._errorsBag.clear();

        if (!request.name) {
            this._errorsBag.add('name is required');
        }

        if (!request.buildingDocumentId) {
            this._errorsBag.add('buildingDocumentId is required');
        }

        if (!request.roomTypeDocumentId) {
            this._errorsBag.add('roomTypeDocumentId is required');
        }
    }
}
