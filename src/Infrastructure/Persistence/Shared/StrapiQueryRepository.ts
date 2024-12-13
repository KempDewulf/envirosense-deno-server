export class StrapiQueryRepository {
    protected readonly baseUrl: string;

    //http://94.130.75.173:1331/api
    constructor(baseUrl: string = 'http://host.docker.internal:1331/api') {
        this.baseUrl = baseUrl;
    }

    private buildUrl(endpoint: string, params?: Record<string, string>): string {
        const url = new URL(`${this.baseUrl}/${endpoint}`);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, value);
                }
            });
        }

        return url.toString();
    }

    private buildRequestOptions(method: string, body?: any): RequestInit {
        const headers = {
            'Content-Type': 'application/json',
        };

        const options: RequestInit = {
            method,
            headers,
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        return options;
    }

    private async handleErrors(response: Response): Promise<void> {
        if (!response.ok) {
            const errorResponse = await response.json();
            if (errorResponse.error) {
                const errorMessages = this.extractErrorMessages(errorResponse.error);
                throw new Error(errorMessages.join('\n'));
            } else {
                throw new Error(`Failed to ${response.statusText}`);
            }
        }
    }

    private async processResponse<T>(response: Response, method: string): Promise<T> {
        if (method.toUpperCase() !== 'DELETE') {
            const data = await response.json();
            return data as T;
        }
        return undefined as unknown as T;
    }

    public async request<T>(
        method: string,
        endpoint: string,
        body?: any,
        params?: Record<string, string>,
    ): Promise<T> {
        if (method.toUpperCase() === 'GET') {
            if (!params || Object.keys(params).length === 0) {
                params = { populate: '*' };
            }
        }

        const url = this.buildUrl(endpoint, params);
        const options = this.buildRequestOptions(method, body);
        console.log(url, options, method, params);
        const response = await fetch(url, options);
        await this.handleErrors(response);
        return await this.processResponse<T>(response, method);
    }

    protected async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        return await this.request<T>('GET', endpoint, undefined, params);
    }

    protected async post<T>(endpoint: string, body: any): Promise<T> {
        return await this.request<T>('POST', endpoint, body);
    }

    protected async put<T>(endpoint: string, body: any): Promise<T> {
        return await this.request<T>('PUT', endpoint, body);
    }

    protected async delete(endpoint: string): Promise<void> {
        await await this.request('DELETE', endpoint);
    }

    private extractErrorMessages(error: any): string[] {
        const messages: string[] = [];
        if (error.message) {
            messages.push(error.message);
        }
        if (error.details?.errors) {
            for (const err of error.details.errors) {
                messages.push(err.message);
            }
        }
        return messages;
    }
}
