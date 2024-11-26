function use(endpoint: Endpoint) {
    return (context: RouterContext<string>) => endpoint.handle(context);
}

export function endpoints(): Router {
    const router = new Router();

    router.get('/', use(new RootEndpoint()));
    router.get('/tournaments', use(new ShowTournamentsEndpoint()));
    router.post('/tournaments', use(new CreateTournamentEndpoint()));
    router.get('/tournament-events', use(new ShowTournamentEventsEndpoint()));
    router.post('/tournament-events', use(new CreateTournamentEventEndpoint()));
    router.post('/tournament-events/:id/players', use(new AddPlayerToTournamentEventEndpoint()));

    return router;
}
