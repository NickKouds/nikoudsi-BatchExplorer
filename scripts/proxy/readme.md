# Deploying Batch Explorer Within a Proxied Environment

In order to test how Batch Explorer behaves within a locked-down environment, it's useful to deploy Batch Explorer within a restricted environment in Azure. In this deployment, Batch Explorer is installed within a Windows VM that is connected to a restricted subnet within a virtual network.

```azurecli
az group create --name "be-proxy" --location --eastus
az deployment group create \
    --resource-group "be-proxy" \
    --template-file proxy-deployment.bicep \
    --parameters prefix=MyDeployment
```


### Notes

1. Create Windows VM with Batch Explorer
1. Create Linux VM with Squid (Proxy)
1. Create NSG on Windows VM
1. Create peering between VPN gateway and Windows VM
