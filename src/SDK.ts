import { APIError } from "./errors";
import { buildAuthedHeaders, buildHeaders } from "./headers";
import { requestConnectionDetails } from "./messaging";

const PLUGIN_AUTH_ENDPOINT = "api/v2/plugin/oauth2/client-token";
const STATUS_CODE_UNAUTHORIZED_401 = 401;

export type FetchOptions = {
    body?: Record<string, unknown>;
    method: RequestInit["method"];
};

export class SDK {
    private accessToken: string = "";
    private apiBaseUrl: string = "";

    async fetch<T>(relativeUrl: string, options: FetchOptions = { method: undefined }): Promise<T> {
        const url = this.buildApiUrl(relativeUrl);
        const formattedOptions = formatOptions(options);
        const response = await this.doFetch(url, formattedOptions);
        const json = await response.json();
        if (! response.ok) {
            throw new APIError(response.status, json);
        }
        return json as T;

        function formatOptions(rawOptions: FetchOptions): RequestInit {
            if (! ("body" in rawOptions)) {
                return rawOptions as { method?: string };
            }
            return {
                ...rawOptions,
                body: JSON.stringify(rawOptions.body)
            };
        }
    }

    getAccessToken() {
        return this.accessToken;
    }

    async init() {
        await this.authenticate();
    }

    private async authenticate() {
        const { apiBaseUrl, temporaryToken } = await requestConnectionDetails();
        this.apiBaseUrl = apiBaseUrl;
        await this.connect(temporaryToken);
    }

    private buildApiUrl(relativeUrl: string) {
        return `${this.apiBaseUrl}/${relativeUrl}`;
    }

    private async connect(temporaryToken: string) {
        const clientAuthUrl = this.buildApiUrl(PLUGIN_AUTH_ENDPOINT);
        const access_token = await fetchAccessToken(clientAuthUrl, temporaryToken);
        this.accessToken = access_token;
    }

    private async doFetch(url: string, options: RequestInit = {}) {
        const response = await fetch(url, {
            ...options,
            headers: buildAuthedHeaders(this.accessToken)
        });
        if (! response.ok && response.status === STATUS_CODE_UNAUTHORIZED_401) {
            await this.authenticate();
            return fetch(url, {
                ...options,
                headers: buildAuthedHeaders(this.accessToken)
            });
        }
        return response;
    }
}

async function fetchAccessToken(url: string, temporaryToken: string) {
    const response = await fetch(url, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ temporaryToken })
    });
    if (! response.ok) {
        throw new Error("API authentication failed.");
    }
    const json = await response.json();
    return json.access_token;
}
