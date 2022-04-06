import {
    getMockEnvironment,
    initMockEnvironment,
} from "@batch/ui-common/lib/environment";
import { MockHttpClient, MockHttpResponse } from "@batch/ui-common/lib/http";
import { StorageAccountService } from "../storage-account-service";

describe("StorageAccountService", () => {
    let httpClient: MockHttpClient;

    beforeEach(() => {
        initMockEnvironment();
        httpClient = getMockEnvironment().getHttpClient();
    });

    test("getStorageAccounts()", async () => {
        const service = new StorageAccountService();

        httpClient.addExpected(
            new MockHttpResponse(
                "/subscriptions/sub1/storageAccounts",
                200,
                `[1, 2, 3]`
            )
        );
        const accounts = await service.getStorageAccounts("sub1");

        expect(accounts.length).toEqual(3);
    });
});
