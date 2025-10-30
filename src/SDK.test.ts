import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as headers from "./headers";
import * as messaging from "./messaging";
import { SDK } from "./SDK";

import type { MockInstance } from "vitest";

describe("SDK", () => {
    let requestTemporaryTokenStub: MockInstance<typeof messaging.requestTemporaryToken>;

    beforeEach(() => {
        vi.spyOn(headers, "buildHeaders").mockReturnValue({});
        requestTemporaryTokenStub = vi.spyOn(messaging, "requestTemporaryToken");
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.unstubAllGlobals();
    });

    describe("init", () => {
        const temporaryToken = "a temporary token";

        beforeEach(() => {
            requestTemporaryTokenStub.mockResolvedValue({
                apiBaseUrl: "http://localhost:3000",
                temporaryToken
            });
        });

        it("should launch an authentication flow to load accessToken", async () => {
            const accessToken = "AnAccessToken";
            vi.stubGlobal("fetch", vi.fn().mockImplementation(() => buildAuthorizedResponse(accessToken)));
            const sdk = new SDK();

            await sdk.init();

            expect(requestTemporaryTokenStub).toHaveBeenCalled();
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
});

function buildUnauthorizedResponse() {
    return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({  }),
        status: 401,
        statusText: 'unauthorized',
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
