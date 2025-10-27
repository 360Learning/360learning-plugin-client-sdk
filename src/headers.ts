import { version } from "../package.json";

export function buildHeaders() {
    return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "360-plugin-client-sdk-version": version
    };
}
