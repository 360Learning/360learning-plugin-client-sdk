const PLUGIN_TEMPORARY_TOKEN_EVENT_TYPE = "plugin:temporaryToken";
const PLUGIN_HANDSHAKE_EVENT_TYPE = "plugin:handshake";

const MAX_LISTENER_TIME_IN_MS = 1000 * 60;

export type TemporaryTokenPayload = {
    apiBaseUrl: string;
    temporaryToken: string;
};

export async function requestTemporaryToken(): Promise<TemporaryTokenPayload> {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(), MAX_LISTENER_TIME_IN_MS);
        window.addEventListener("message", handleMessage, false);

        window.parent.postMessage({ type: PLUGIN_HANDSHAKE_EVENT_TYPE }, "*");

        function handleMessage(event: MessageEvent) {
            if (event.data.type !== PLUGIN_TEMPORARY_TOKEN_EVENT_TYPE) { return; }

            resolve({
                apiBaseUrl: event.data.apiBaseUrl,
                temporaryToken: event.data.token
            });
            window.removeEventListener("message", handleMessage);
        }
    });
}