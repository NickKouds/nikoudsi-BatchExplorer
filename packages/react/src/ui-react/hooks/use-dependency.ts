import { DependencyName, getEnvironment } from "@batch/ui-common";

export function useDependency<T>(dependencyName: DependencyName) {
    return getEnvironment().getInjectable<T>(dependencyName);
}
