export declare function createSDK(): SDK;

declare type FetchOptions = {
    body?: Record<string, unknown>;
    method?: string;
};

declare class SDK {
    private accessToken;
    private apiBaseUrl;
    fetch<T>(relativeUrl: string, options?: FetchOptions): Promise<T>;
    getAccessToken(): string;
    init(): Promise<void>;
    private authenticate;
    private buildApiUrl;
    private connect;
    private doFetch;
}

export { }
