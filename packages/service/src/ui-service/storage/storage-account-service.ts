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
            `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Storage/storageAccounts?api-version=2021-04-01`,
            {}
        );
        const json = await response.json();
        console.log("JSON", json);
        return (json as any).value as StorageAccount[];
    }
}
