import { Endpoint } from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { RouterContext } from '@oak/oak';

export class TestEndpoint implements Endpoint {
    handle(context: RouterContext<string>): Promise<void> {
        const html = `
            <html>
                <head>
                    <title>Test Endpoint</title>
                </head>
                <body>

                    <h1>Test Endpoint</h1>
                    <p>Welcome to the Test Endpoint</p>
                </body>
            </html>`;

        context.response.body = html;
        context.response.headers.set('Content-Type', 'text/html');

        return Promise.resolve();
    }

    static create(): Endpoint {
        return new TestEndpoint();
    }

}