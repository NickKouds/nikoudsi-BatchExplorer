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
        if (!authRequestProps.headers) {
            authRequestProps.headers = {};
        }
        authRequestProps.headers["Authorization"] =
            `${accessToken.tokenType} ${accessToken.accessToken}`;
        return this._delegate.fetch(urlOrRequest, authRequestProps);
    }

    private getTenantIdFor(urlOrRequest: string | HttpRequest | Request):
    string {
        let tenantId;
        if (typeof urlOrRequest === "string") {
            tenantId = "";
        }
        return tenantId;
    }
}
