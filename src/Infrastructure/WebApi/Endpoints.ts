import { Router, RouterContext } from '@oak/oak';
import {
    Endpoint,
    RootEndpoint,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';

function use(endpoint: Endpoint) {
    return (context: RouterContext<string>) => endpoint.handle(context);
}

export function endpoints(): Router {
    const router = new Router();

    router.get('/', use(new RootEndpoint()));

    return router;
}
