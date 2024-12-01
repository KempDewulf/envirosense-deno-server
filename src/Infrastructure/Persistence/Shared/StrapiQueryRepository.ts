export class StrapiQueryRepository {
    protected readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    protected async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        return this.request<T>('GET', endpoint, undefined, params);
    }

    protected async post<T>(endpoint: string, body: any): Promise<T> {
        return this.request<T>('POST', endpoint, body);
    }

    protected async put<T>(endpoint: string, body: any): Promise<T> {
        return this.request<T>('PUT', endpoint, body);
    }

    protected async delete(endpoint: string): Promise<void> {
        await this.request('DELETE', endpoint);
    }

    private async request<T>(
        method: string,
        endpoint: string,
        body?: any,
        params?: Record<string, string>,
    ): Promise<T> {
        const url = new URL(`${this.baseUrl}/${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value) {
                    url.searchParams.append(key, value);
                }
            });
        }
        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(url.toString(), options);
        if (!response.ok) {
            throw new Error(`Failed to ${method} ${endpoint}: ${response.statusText}`);
        }
        if (method !== 'DELETE') {
            const data = await response.json();
            return data as T;
        }
        return undefined as unknown as T;
    }
}
