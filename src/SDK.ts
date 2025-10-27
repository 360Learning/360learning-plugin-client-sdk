import { buildHeaders } from "./headers";
import { requestTemporaryToken } from "./messaging";

const PLUGIN_AUTH_ENDPOINT = "api/v2/plugin/oauth2/client-token";

export class SDK {
    private apiBaseUrl: string = "";

    async init() {
        await this.authenticate();
    }

    private async authenticate() {
        const { apiBaseUrl, temporaryToken } = await requestTemporaryToken();
        this.apiBaseUrl = apiBaseUrl;
        // load access token
    }

    private buildApiUrl(relativeUrl: string) {
        return `${this.apiBaseUrl}/${relativeUrl}`;
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
