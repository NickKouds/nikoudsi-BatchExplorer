import { UrlOrRequestType } from "@batch/ui-common/lib-cjs/http";

const SUBSCRIPTION_REGEX = new RegExp("/subscriptions/([a-f0-9\-]{36,})", "i");

/**
 * Gets the subscription ID from the provided URL
 */
export function getSubscriptionIdFromUrl(urlOrRequest: UrlOrRequestType):
string {
    const url = urlFor(urlOrRequest);
    return url.match(SUBSCRIPTION_REGEX)[1];
}

export function urlFor(urlOrRequest: UrlOrRequestType): string {
    if (typeof urlOrRequest === "string") {
        return urlOrRequest;
    }
    return urlOrRequest.url;
}
