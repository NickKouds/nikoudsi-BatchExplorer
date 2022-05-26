import { EnvironmentMode, initEnvironment } from "@batch/ui-common";
import { DependencyName } from "@batch/ui-common/lib/environment";
import { ConsoleLogger } from "@batch/ui-common/lib/logging";
import { MockHttpClient } from "@batch/ui-common/lib/http";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Application } from "./components";
import {
    BrowserDependencyName,
    DefaultBrowserEnvironment,
} from "@batch/ui-react/lib/environment";
import {
    DefaultFormLayoutProvider,
    DefaultParameterTypeResolver,
} from "@batch/ui-react/lib/components/form";

import GeneratedClient from "@azure/batch";
//import { DefaultAzureCredential } from "@azure/identity";
// eslint-disable-next-line no-console
console.log(GeneratedClient);
// const client = GeneratedClient(
//     "https://sdktest.westus.batch.azure.com",
//     new DefaultAzureCredential()
// );

// const result = client.path("/pools/{poolId}", "mylinuxtestpool").get();
// // eslint-disable-next-line no-console
// console.log(result);

// Defined by webpack
declare const ENV: {
    MODE: EnvironmentMode;
};

export function init(rootEl: HTMLElement): void {
    initEnvironment(
        new DefaultBrowserEnvironment(
            {
                mode: ENV.MODE ?? EnvironmentMode.Development,
            },
            {
                [DependencyName.Logger]: () => new ConsoleLogger(),
                [DependencyName.HttpClient]: () => new MockHttpClient(),
                [BrowserDependencyName.ParameterTypeResolver]: () => {
                    return new DefaultParameterTypeResolver();
                },
                [BrowserDependencyName.FormLayoutProvider]: () => {
                    return new DefaultFormLayoutProvider();
                },
            }
        )
    );
    ReactDOM.render(<Application />, rootEl);
}
