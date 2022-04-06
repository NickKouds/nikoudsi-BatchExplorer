import { AbstractHttpService } from "../http-service";
import { StorageAccount } from "./storage-account-models";

export interface StorageAccountService {
    getStorageAccounts(subscriptionId: string): Promise<StorageAccount[]>;
}

export class StorageAccountServiceImpl
    extends AbstractHttpService
    implements StorageAccountService
{
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
