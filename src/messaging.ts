const PLUGIN_CONNECTION_DETAILS_EVENT_TYPE = "plugin:connectionDetails";
const PLUGIN_REQUEST_CONNECTION_DETAILS_EVENT_TYPE = "plugin:requestConnectionDetails";

const MAX_LISTENER_TIME_IN_MS = 1000 * 60;

export type ConnectionDetails = {
    apiBaseUrl: string;
    temporaryToken: string;
};

export async function requestConnectionDetails(): Promise<ConnectionDetails> {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(onRequestTimeout, MAX_LISTENER_TIME_IN_MS);
        window.addEventListener("message", handleMessage, false);

        window.parent.postMessage({ type: PLUGIN_REQUEST_CONNECTION_DETAILS_EVENT_TYPE }, "*");

        function handleMessage(event: MessageEvent) {
            if (event.data.type !== PLUGIN_CONNECTION_DETAILS_EVENT_TYPE) { return; }

            resolve({
                apiBaseUrl: event.data.apiBaseUrl,
                temporaryToken: event.data.token
            });

            clearTimeout(timeoutId);
            window.removeEventListener("message", handleMessage);
        }

        function onRequestTimeout() {
            window.removeEventListener("message", handleMessage);
            reject();
        }
    });
}