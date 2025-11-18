import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as headers from "./headers";
import * as messaging from "./messaging";
import { SDK } from "./SDK";

import type { MockInstance } from "vitest";

describe("SDK", () => {
    let requestConnectionDetailsStub: MockInstance<typeof messaging.requestConnectionDetails>;

    beforeEach(() => {
        vi.spyOn(headers, "buildHeaders").mockReturnValue({});
        requestConnectionDetailsStub = vi.spyOn(messaging, "requestConnectionDetails");
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.unstubAllGlobals();
    });

    describe("init", () => {
        const temporaryToken = "a temporary token";

        beforeEach(() => {
            requestConnectionDetailsStub.mockResolvedValue({
                apiBaseUrl: "http://localhost:3000",
                temporaryToken
            });
        });

        it("should launch an authentication flow to load accessToken", async () => {
            const accessToken = "AnAccessToken";
            vi.stubGlobal("fetch", vi.fn().mockImplementation(() => buildAuthorizedResponse(accessToken)));
            const sdk = new SDK();

            await sdk.init();

            expect(requestConnectionDetailsStub).toHaveBeenCalled();
            expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/api/v2/plugin/oauth2/client-token", {
                body: `{"temporaryToken":"${temporaryToken}"}`,
                headers: {},
                method: "POST"
            });
            expect(sdk.getAccessToken()).toEqual(accessToken);
        });

        it("should throw if authentication failed", async () => {
            vi.stubGlobal("fetch", vi.fn().mockImplementation(() => buildUnauthorizedResponse()));
            const sdk = new SDK();

            const promise = sdk.init();

            await expect(promise).rejects.toThrowError("API authentication failed.");
        });
    });

    describe("fetch", () => {
        it("should return data fetched from the api", async () => {
            const accessToken = "access token";
            const payload = { field: "value" };
            vi.stubGlobal("fetch", vi.fn()
                .mockImplementationOnce(() => buildAuthorizedResponse(accessToken))
                .mockImplementationOnce(() => buildApiResponse(payload))
            );
            vi.spyOn(headers, "buildAuthedHeaders")
                .mockImplementation((token: string) => ({ Authorization: `Bearer ${token}` } as unknown));
            const sdk = new SDK();
            await sdk.init();

            const result = await sdk.fetch("api/me", {
                method: "GET"
            });

            expect(global.fetch).toHaveBeenNthCalledWith(2, "http://localhost:3000/api/me", {
                headers: { Authorization: `Bearer ${accessToken}` },
                method: "GET"
            });
            expect(result).to.deep.equal(payload);
        });

        it("should relaunch authentication flow on authentication error received from the api", async () => {
            const payload = { field: "value" };
            const authenticateStub = vi.spyOn(SDK.prototype as unknown, "authenticate").mockImplementation(() => {});
            vi.stubGlobal("fetch", vi.fn()
                .mockImplementationOnce(() => buildUnauthorizedResponse())
                .mockImplementationOnce(() => buildApiResponse(payload))
            );
            vi.spyOn(headers, "buildAuthedHeaders").mockImplementation(() => ({} as unknown));
            const sdk = new SDK();

            const result = await sdk.fetch("api/me", { method: "GET" });

            expect(authenticateStub).toHaveBeenCalled();
            expect(global.fetch).toHaveBeenNthCalledWith(1, "/api/me", { headers: {}, method: "GET" });
            expect(global.fetch).toHaveBeenNthCalledWith(2, "/api/me", { headers: {}, method: "GET" });
            expect(result).to.deep.equal(payload);
        });

        it("should throw error on error received from the api", async () => {
            vi.stubGlobal("fetch", vi.fn()
                .mockImplementationOnce(() => buildErrorResponse(403, "forbidden"))
            );
            vi.spyOn(headers, "buildAuthedHeaders").mockImplementation(() => ({} as unknown));
            const sdk = new SDK();

            const promise = () => sdk.fetch("api/me", { method: "GET" });

            await expect(promise).rejects.toThrowError("Error 403 received from the API");
        });
    });
});

function buildUnauthorizedResponse() {
    return buildErrorResponse(401, "unauthorized");
}

function buildErrorResponse(status: number, statusText: string) {
    return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({  }),
        status,
        statusText,
        clone: function () {
            return { ...this };
        }
    });
}

function buildAuthorizedResponse(accessToken: string) {
    return buildApiResponse({ access_token: accessToken });
}

function buildApiResponse(payload: Record<string, unknown>) {
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(payload),
        status: 200,
        statusText: 'OK',
        clone: function () {
            return { ...this };
        }
    });
}
