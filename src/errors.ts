export class APIError extends Error {
    public readonly status: number;
    public readonly json: unknown;

    constructor(status: number, json: unknown) {
        super(`Error ${status} received from the API`);
        this.name = "APIError";
        this.status = status;
        this.json = json;
    }
}
