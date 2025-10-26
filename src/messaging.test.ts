import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { requestTemporaryToken } from "./messaging";

describe("messaging", () => {
    describe("requestTemporaryToken", async () => {
        it("should return a temporary token and the base url for the API", async () => {
            const temporaryToken = "fakeToken";
            const apiBaseUrl = "http://localhost:3000";

            const promise = requestTemporaryToken();
            window.postMessage({
                type: "plugin:temporaryToken",
                token: temporaryToken,
                apiBaseUrl
            }, "*");

            await expect(promise).resolves.toEqual({ temporaryToken, apiBaseUrl });
        });
    });
});
