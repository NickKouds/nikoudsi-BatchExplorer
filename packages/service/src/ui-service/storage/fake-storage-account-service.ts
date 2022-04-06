import { StorageAccount } from "./storage-account-models";
import { StorageAccountService } from "./storage-account-service";

export class FakeStorageAccountService implements StorageAccountService {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public getStorageAccounts(_: string): Promise<StorageAccount[]> {
        return Promise.resolve([
            { id: "/fake/sub1", name: "Storage Four" },
            { id: "/fake/sub2", name: "Storage Two" },
            { id: "/fake/sub3", name: "Storage Three" },
        ]);
    }
}
