const PLUGIN_TEMPORARY_TOKEN_EVENT_TYPE = "plugin:temporaryToken";
const PLUGIN_HANDSHAKE_EVENT_TYPE = "plugin:handshake";

export type TemporaryTokenPayload = {
    apiBaseUrl: string;
    temporaryToken: string;
};

export async function requestTemporaryToken(): Promise<TemporaryTokenPayload> {
    return new Promise((resolve) => {
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