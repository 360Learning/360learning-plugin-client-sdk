import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { requestConnectionDetails } from "./messaging";

describe("messaging", () => {
    describe("requestTemporaryToken", async () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("should throw if no message is received in response within 1min", async () => {
            const promise = requestConnectionDetails();
            vi.advanceTimersByTime(60 * 1000);

            await expect(promise).rejects.toThrow(undefined);
        });

        it("should not throw before 1min if no message is received in response", async () => {
            const promise = requestConnectionDetails();
            vi.advanceTimersByTime(59 * 1000);

            expect(promise).not.rejects;
        });

        it("should return a temporary token and the base url for the API", async () => {
            const temporaryToken = "fakeToken";
            const apiBaseUrl = "http://localhost:3000";

            const promise = requestConnectionDetails();
            window.postMessage({
                apiBaseUrl,
                token: temporaryToken,
                type: "plugin:connectionDetails",
                version: 1
            }, "*");

            await expect(promise).resolves.toEqual({ temporaryToken, apiBaseUrl });
        });
    });
});
