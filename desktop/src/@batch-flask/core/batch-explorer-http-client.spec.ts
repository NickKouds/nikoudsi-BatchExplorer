import { of } from "rxjs";
import BatchExplorerHttpClient from "./batch-explorer-http-client";

describe("BatchExplorerHttpClient", () => {
    let httpClient: BatchExplorerHttpClient;
    let fakeAuthService;
    let fakeSubscriptionService;
    beforeEach(() => {
        fakeSubscriptionService = {
            get: jasmine.createSpy("get").and.returnValue([
                of({ tenantId: "myTenant" })
            ])
        };
        fakeAuthService = {
            getAccessToken: jasmine.createSpy("getAccessToken").and
                .returnValue([
                    new Promise(resolve => resolve({
                        accessToken: "token1",
                        tokenType: "Bearer"
                    }))
                ])
        };
        httpClient = new BatchExplorerHttpClient(
            fakeAuthService,
            fakeSubscriptionService
        )
    });
    describe("fetch", () => {
        it("loads an access token for the specified sub", async () => {
            const response = httpClient.fetch("/subscriptions/deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef");

            expect(fakeSubscriptionService.get).toHaveBeenCalledOnce();
            expect(fakeAuthService.getAccessToken)
                .toHaveBeenCalledWith("myTenant");
            expect(response).not.toBeNull();
        });
    });
});
