import { Endpoint } from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { RouterContext } from '@oak/oak';

export class ShowOpenApiEndpoint implements Endpoint {
    handle(context: RouterContext<string>): Promise<void> {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>OpenAPI UI</title>
                <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
            </head>
            <body>
                <div id="swagger-ui"></div>
                <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
                <script>
                    const ui = SwaggerUIBundle({
                        url: './openapi.yml',
                        dom_id: '#swagger-ui',
                    });
                </script>
            </body>
            </html>
        `;

        context.response.body = html;
        context.response.headers.set('Content-Type', 'text/html');

        return Promise.resolve();
    }

    static create(): Endpoint {
        return new ShowOpenApiEndpoint();
    }

}