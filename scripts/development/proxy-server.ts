import * as httpProxy from "http-proxy";

console.log("Running proxy server");

const proxy = httpProxy.createProxyServer({
    target: "http://localhost:3178"
});

proxy.listen(9090);
