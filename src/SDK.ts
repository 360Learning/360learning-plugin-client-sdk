import { requestTemporaryToken } from "./messaging";

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
