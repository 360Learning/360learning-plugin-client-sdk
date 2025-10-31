import { buildHeaders } from "./headers";
import { requestConnectionDetails } from "./messaging";

const PLUGIN_AUTH_ENDPOINT = "api/v2/plugin/oauth2/client-token";

export class SDK {
    private accessToken: string = "";
    private apiBaseUrl: string = "";

    getAccessToken() {
        return this.accessToken;
    }

    async init() {
        await this.authenticate();
    }

    private async authenticate() {
        const { apiBaseUrl, temporaryToken } = await requestConnectionDetails();
        this.apiBaseUrl = apiBaseUrl;
        await this.loadAccessToken(temporaryToken);
    }

    private buildApiUrl(relativeUrl: string) {
        return `${this.apiBaseUrl}/${relativeUrl}`;
    }

    private async loadAccessToken(temporaryToken: string) {
        const clientAuthUrl = this.buildApiUrl(PLUGIN_AUTH_ENDPOINT);
        const access_token = await fetchAccessToken(clientAuthUrl, temporaryToken);
        this.accessToken = access_token;
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
