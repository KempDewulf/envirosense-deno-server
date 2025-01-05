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
                    .sidebar {
                        width: 250px;
                        height: 100vh;
                        background: #2c3e50;
                        position: fixed;
                        left: 0;
                        top: 0;
                        transition: 0.3s;
                        color: white;
                        padding-top: 20px;
                    }
                    .sidebar.collapsed {
                        width: 60px;
                    }
                    .sidebar-item {
                        padding: 15px 25px;
                        cursor: pointer;
                        transition: 0.3s;
                        display: flex;
                        align-items: center;
                    }
                    .sidebar-item:hover {
                        background: #34495e;
                    }
                    .sidebar-item.active {
                        background: #3498db;
                    }
                    .content {
                        margin-left: 250px;
                        transition: 0.3s;
                        padding: 20px;
                    }
                    .content.expanded {
                        margin-left: 60px;
                    }
                    .toggle-sidebar {
                        position: absolute;
                        bottom: 20px;
                        left: 20px;
                        background: none;
                        border: none;
                        color: white;
                        cursor: pointer;
                        font-size: 20px;
                    }
                    .hidden {
                        display: none;
                    }
                </style>
            </head>
            <body>
                <div class="wrapper">
            <div class="sidebar" id="sidebar">
                <div class="sidebar-item" onclick="showDoc('openapi')" id="openapi-tab">OpenAPI</div>
                <div class="sidebar-item" onclick="showDoc('asyncapi')" id="asyncapi-tab">AsyncAPI</div>
            </div>

            <div class="content" id="content">
                <div id="swagger-ui" class="doc-container"></div>
                <div id="asyncapi" class="doc-container hidden"></div>
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
                        const containers = document.getElementsByClassName('doc-container');
                        const tabs = document.getElementsByClassName('sidebar-item');

                        for (let tab of tabs) {
                            tab.classList.remove('active');
                        }

                        for (let container of containers) {
                            container.classList.add('hidden');
                        }

                        if (type === 'openapi') {
                            document.getElementById('swagger-ui').classList.remove('hidden');
                            document.getElementById('openapi-tab').classList.add('active');
                        } else {
                            document.getElementById('asyncapi').classList.remove('hidden');
                            document.getElementById('asyncapi-tab').classList.add('active');
                        }
                    }

                    function toggleSidebar() {
                        document.getElementById('sidebar').classList.toggle('collapsed');
                        document.getElementById('content').classList.toggle('expanded');
                    }

                    // Set OpenAPI as default active tab
                    document.getElementById('openapi-tab').classList.add('active');
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
