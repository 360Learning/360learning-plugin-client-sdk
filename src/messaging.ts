const PLUGIN_TEMPORARY_TOKEN_EVENT_TYPE = "plugin:temporaryToken";

export type TemporaryTokenPayload = {
    apiBaseUrl: string;
    temporaryToken: string;
};

export async function requestTemporaryToken(): Promise<TemporaryTokenPayload> {
    return new Promise((resolve) => {
        window.addEventListener("message", handleMessage, false);

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