export abstract class StrapiQueryRepository {
    protected baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    protected async read<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Strapi request failed: ${response.statusText}`);
        }
        const data = await response.json();
        return data as T;
    }

    protected async write<T>(
        endpoint: string,
        method: "POST" | "PUT" | "DELETE",
        payload?: any
    ): Promise<T> {
        const options: RequestInit = {
            method,
            headers: { "Content-Type": "application/json" },
            body: payload ? JSON.stringify({ data: payload }) : undefined,
        };
        const response = await fetch(`${this.baseUrl}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`Strapi request failed: ${response.statusText}`);
        }
        const data = await response.json();
        return data as T;
    }
}
