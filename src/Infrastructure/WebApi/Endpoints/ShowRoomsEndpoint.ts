import { Endpoint } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RouterContext } from "https://jsr.io/@oak/oak/16.1.0/router.ts";

export class ShowRoomsEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        const view = new ShowRoomsView();
        const outputDevice = new RequestResponse<ShowRoomsPresentedData[]>(
            view
        );
        const presenter = new ShowRoomsPresenter(outputDevice);

        const repository = new RoomStrapiQueryRepository();

        const useCase = new ShowRoomsEndpoint(presenter, repository);

        const controller = new ShowRoomsController(useCase);
        const request = this.buildRequest(context);
        await controller.handle(request);

        context.response.headers.set("Content-Type", "text/html");
        context.response.body = outputDevice.response;

        return Promise.resolve();
    }
}
