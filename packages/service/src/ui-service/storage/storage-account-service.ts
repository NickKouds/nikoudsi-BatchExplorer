import { AbstractHttpService } from "../http-service";
import { StorageAccount } from "./storage-account-models";

export class StorageAccountService extends AbstractHttpService {
    public async getStorageAccounts(
        subscription: ArmSubscription
    ): Promise<StorageAccount[]> {
        const response = await this.httpClient.get(
            `/subscriptions/${subscription.subscriptionId}/storageAccounts`,
            {}
        );
        // const json = await response.json();
        // console.log("JSON", json);
        return [
            { id: "/fake/sub1", name: "Storage Four" },
            { id: "/fake/sub2", name: "Storage Two" },
            { id: "/fake/sub3", name: "Storage Three" },
        ];
    }
}
