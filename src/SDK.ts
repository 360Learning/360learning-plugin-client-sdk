import { requestTemporaryToken } from "./messaging";

export class SDK {

    async init() {
        await this.authenticate();
    }

    private async authenticate() {
        const { apiBaseUrl, temporaryToken } = await requestTemporaryToken();
        // load access token
    }
}
