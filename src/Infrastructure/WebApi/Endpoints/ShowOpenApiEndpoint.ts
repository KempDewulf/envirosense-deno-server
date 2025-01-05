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
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                    }
                    .envirosense__wrapper {
                        display: flex;
                        height: 100vh;
                    }
                    .envirosense__sidebar {
                        width: 200px;
                        background-color: #2d3748;
                        padding: 20px;
                    }
                    .envirosense__content {
                        flex: 1;
                        padding: 20px;
                    }
                    .envirosense__sidebar-item {
                        color: white;
                        padding: 10px;
                        cursor: pointer;
                        margin-bottom: 10px;
                    }
                    .envirosense__sidebar-item:hover {
                        background-color: #4a5568;
                    }
                    .envirosense__doc-container {
                        height: 100%;
                    }
                    @media screen and (max-width: 768px) {
                        .envirosense__wrapper {
                            flex-direction: column;
                        }
                        .envirosense__sidebar {
                            width: 100%;
                            display: flex;
                            padding: 10px;
                            justify-content: center;
                        }
                        .envirosense__sidebar-item {
                            margin: 0 10px;
                        }
                        .envirosense__content {
                            height: calc(100vh - 60px);
                        }
                    }
                    .envirosense__hidden {
                        display: none;
                    }
                    .envirosense__active {
                        background-color: #4a5568;
                    }
                </style>
            </head>
            <body>
                <div class="envirosense__wrapper">
            <div class="envirosense__sidebar" id="sidebar">
                <div class="envirosense__sidebar-item" onclick="showDoc('openapi')" id="openapi-tab">OpenAPI</div>
                <div class="envirosense__sidebar-item" onclick="showDoc('asyncapi')" id="asyncapi-tab">AsyncAPI</div>
            </div>

            <div class="envirosense__content" id="content">
                <div id="swagger-ui" class="envirosense__doc-container"></div>
                <div id="asyncapi" class="envirosense__doc-container hidden"></div>
            </div>
        </div>

                <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
                <script src="https://unpkg.com/@asyncapi/react-component@latest/browser/standalone/index.js"></script>

                <script>
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
                        const containers = document.getElementsByClassName('envirosense__doc-container');
                        const tabs = document.getElementsByClassName('envirosense__sidebar-item');

                        for (let tab of tabs) {
                            tab.classList.remove('envirosense__active');
                        }

                        for (let container of containers) {
                            container.classList.add('envirosense__hidden');
                        }

                        if (type === 'openapi') {
                            document.getElementById('swagger-ui').classList.remove('envirosense__hidden');
                            document.getElementById('openapi-tab').classList.add('envirosense__active');
                        } else {
                            document.getElementById('asyncapi').classList.remove('envirosense__hidden');
                            document.getElementById('asyncapi-tab').classList.add('envirosense__active');
                        }
                    }

                    // Set OpenAPI as default active tab
                    document.getElementById('openapi-tab').classList.add('envirosense__active');
                </script>
            </body>
            </html>
        `;
		context.response.body = html;
		context.response.headers.set("Content-Type", "text/html");

		return Promise.resolve();
	}

	static create(): Endpoint {
		return new ShowOpenApiEndpoint();
	}
}
