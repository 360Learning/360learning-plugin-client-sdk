import { version } from "../package.json";

export function buildHeaders() {
    return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "360-plugin-client-sdk-version": version
    };
}

export function buildAuthedHeaders(accessToken: string) {
    return {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "360-api-version": "v2.0",
        "360-plugin-client-sdk-version": version
    };
}
