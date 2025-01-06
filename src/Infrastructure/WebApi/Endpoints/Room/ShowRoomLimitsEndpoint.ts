export class ShowRoomLimitsEndpoint implements Endpoint {
    private readonly errorsBag = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        const roomDocumentId = context.params.roomDocumentId;

        if (!roomDocumentId) {
            context.response.status = 400;
            context.response.body = { error: "roomDocumentId is required" };
            return;
        }

        const outputDevice = new RequestResponse<ShowRoomLimitsPresentedData>();
        const presenter = new ShowRoomLimitsPresenter(outputDevice);
        const repository = new RoomStrapiRepository();
        const messaging = MessagingBuilder.getInstance();
        const useCase = new ShowRoomLimits(presenter, repository, messaging);
        const controller = new ShowRoomLimitsController(useCase);

        try {
            await controller.handle({ roomDocumentId });
            context.response.status = 200;
            context.response.body = outputDevice.response;
        } catch (error) {
            if (error.message.includes("did not respond")) {
                context.response.status = 504;
                context.response.body = { error: error.message };
            } else {
                throw error;
            }
        }
    }
}
