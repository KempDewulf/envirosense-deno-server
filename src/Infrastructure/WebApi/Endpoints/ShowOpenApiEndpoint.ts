import { Endpoint } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RouterContext } from "@oak/oak";

export class ShowOpenApiEndpoint implements Endpoint {
    handle(context: RouterContext<string>): Promise<void> {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>EnviroSense API Documentation</title>
                <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
                <link rel="stylesheet" href="https://unpkg.com/@asyncapi/react-component@latest/styles/default.min.css">
                <style>
                    .toggle-container {
                        text-align: center;
                        margin: 20px;
                    }
                    .toggle-switch {
                        padding: 10px 20px;
                        margin: 0 10px;
                        cursor: pointer;
                    }
                    .hidden {
                        display: none;
                    }
                </style>
            </head>
            <body>
                <div class="toggle-container">
                    <button class="toggle-switch" onclick="showDoc('openapi')">OpenAPI</button>
                    <button class="toggle-switch" onclick="showDoc('asyncapi')">AsyncAPI</button>
                </div>

                <div id="swagger-ui" class="doc-container"></div>
                <div id="asyncapi" class="doc-container hidden"></div>

                <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
                <script src="https://unpkg.com/@asyncapi/react-component@latest/browser/standalone/index.js"></script>

                <script>
                    // Initialize OpenAPI UI
                    const ui = SwaggerUIBundle({
                        url: '../../../../openapi.yml',
                        dom_id: '#swagger-ui',
                        presets: [
                            SwaggerUIBundle.presets.apis,
                            SwaggerUIBundle.SwaggerUIStandalonePreset
                        ],
                        layout: "BaseLayout"
                    });

                    async function initAsyncApi() {
        try {
            const response = await fetch('../../../../asyncapi.yml');
            const schema = await response.text();

            AsyncApiStandalone.render({
                schema: schema,
                config: {},
            }, document.getElementById('asyncapi'));
        } catch (error) {
            console.error('Error loading AsyncAPI schema:', error);
            document.getElementById('asyncapi').innerHTML = 'Error loading AsyncAPI documentation';
        }
    }

                    initAsyncApi();

                    function showDoc(type) {
                        const containers = document.getElementsByClassName('doc-container');
                        for (let container of containers) {
                            container.classList.add('hidden');
                        }
                        if (type === 'openapi') {
                            document.getElementById('swagger-ui').classList.remove('hidden');
                        } else {
                            document.getElementById('asyncapi').classList.remove('hidden');
                        }
                    }
                </script>
            </body>
            </html>
        `;

        context.response.headers.set("Content-Type", "text/html");
        context.response.body = html;

        return Promise.resolve();
    }

    static create(): Endpoint {
        return new ShowOpenApiEndpoint();
    }
}
