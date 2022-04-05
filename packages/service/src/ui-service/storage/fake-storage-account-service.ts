import { StorageAccount } from "./storage-account-models";

export class FakeStorageAccountService {
    public getStorageAccounts(): Promise<StorageAccount[]> {
        console.log("Fake!");
        return Promise.resolve([
            { id: "/fake/sub1", name: "Storage Four" },
            { id: "/fake/sub2", name: "Storage Two" },
            { id: "/fake/sub3", name: "Storage Three" },
        ]);
    }
}
