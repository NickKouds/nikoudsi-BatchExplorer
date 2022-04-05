import { DependencyName, getEnvironment } from "@batch/ui-common";
import {
    FakeStorageAccountService,
    StorageAccountService,
} from "@batch/ui-service";

export function useDependency(dependencyName: DependencyName) {
    switch (dependencyName) {
        case DependencyName.StorageAccountService:
            return getEnvironment().name === "mock"
                ? new FakeStorageAccountService()
                : new StorageAccountService();
        default:
            throw new Error(`Unrecognized dependency ${dependencyName}`);
    }
}
