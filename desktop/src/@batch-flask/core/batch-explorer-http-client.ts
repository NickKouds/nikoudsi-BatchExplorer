import { AbstractHttpClient, FetchHttpClient, HttpRequest, HttpRequestInit } from "@batch/ui-common/lib/http";
import { AuthService } from "app/services";
import { AccessToken } from "./aad";

export default class BatchExplorerHttpClient extends AbstractHttpClient {
    private _delegate: FetchHttpClient;

    constructor(
        private authService: AuthService
    ) {
        super();
    }

    public async fetch(
        urlOrRequest: string | HttpRequest | Request,
        requestProps?: HttpRequestInit
    ): Promise<Response> {
        const tenantId = this.getTenantIdFor(urlOrRequest);
        const accessToken: AccessToken =
            await this.authService.getAccessToken(tenantId);
        const authRequestProps = {...requestProps};
        authRequestProps.headers.set("Authorization",
            `${accessToken.tokenType} ${accessToken.accessToken}`);
        return this._delegate.fetch(urlOrRequest, authRequestProps);
    }

    private getTenantId(urlOrRequest: string | HttpRequest | Request) {
        let subscriptionId;
        if (typeof urlOrRequest === "string") {
            subscriptionId = "";
        }
    }
}
