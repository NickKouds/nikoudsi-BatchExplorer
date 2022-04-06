import { AbstractHttpService } from "../http-service";
import { StorageAccount } from "./storage-account-models";

export class StorageAccountService extends AbstractHttpService {
    public async getStorageAccounts(
        subscriptionId: string
    ): Promise<StorageAccount[]> {
        const response = await this.httpClient.get(
            `/subscriptions/${subscriptionId}/storageAccounts`,
            {}
        );
        const json = await response.json();
        return json as StorageAccount[];
    }
}
