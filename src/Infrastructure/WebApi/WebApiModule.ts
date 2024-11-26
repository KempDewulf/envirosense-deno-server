export class WebApiModule implements Module {
    private readonly _port: number;

    constructor(port: number) {
        this._port = port;
    }

    run(): Promise<void> {
        console.log(`WebApi running on port http://127.0.0.1:${this._port}`);

        const app = new Application();

        app.use(errorHandlingMiddleware);

        app.use(oakCors(
            {
                origin: '*',
                optionsSuccessStatus: 200,
                methods: ['*'],
                allowedHeaders: ['*'],
                exposedHeaders: ['*'],
            },
        ));

        const router = endpoints();

        app.use(router.routes());
        app.use(router.allowedMethods());

        return app.listen({ port: this._port });
    }
}
