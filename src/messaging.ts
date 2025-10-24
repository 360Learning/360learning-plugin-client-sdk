export type TemporaryTokenPayload = {
    apiBaseUrl: string;
    temporaryToken: string;
};

export async function requestTemporaryToken(): Promise<TemporaryTokenPayload> {
    return {
        apiBaseUrl: "",
        temporaryToken: ""
    }
}
