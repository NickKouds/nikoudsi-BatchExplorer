import { getSubscriptionIdFromUrl } from "@batch-flask/utils";
import { AbstractHttpClient, FetchHttpClient, HttpRequestInit, UrlOrRequestType } from "@batch/ui-common/lib-cjs/http";
import { AuthService, SubscriptionService } from "app/services";
import { AccessToken } from "./aad";

export default class BatchExplorerHttpClient extends AbstractHttpClient {
    private _delegate: FetchHttpClient;

    constructor(
        private authService: AuthService,
        private subscriptionService: SubscriptionService
    ) {
        super();
        this._delegate = new FetchHttpClient();
    }

    public async fetch(
        urlOrRequest: UrlOrRequestType,
        requestProps?: HttpRequestInit
    ): Promise<Response> {
        const tenantId = await this.getTenantIdFor(urlOrRequest);
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

    private getTenantIdFor(urlOrRequest: UrlOrRequestType): Promise<string> {
        const subscriptionId = getSubscriptionIdFromUrl(urlOrRequest);
        return new Promise(resolve =>
            this.subscriptionService.get(subscriptionId)
                .subscribe(subscription => resolve(subscription.tenantId))
        );
    }
}
