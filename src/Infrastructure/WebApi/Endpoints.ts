import { Router, RouterContext } from '@oak/oak';
import {
    Endpoint,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';

function use(endpoint: Endpoint) {
    return (context: RouterContext<string>) => endpoint.handle(context);
}

export function endpoints(): Router {
    const router = new Router();

    router.get('/', "<p>EnviroSense API</p>");

    return router;
}
