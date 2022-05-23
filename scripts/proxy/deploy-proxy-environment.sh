#!/bin/bash

param_file=$1
location=$2

function usage {
    cat <<USAGE
$0 [parameter_file] [location]

    parameter_file: A JSON file with ARM parameters
    location: A valid Azure location
USAGE
}

if [ -z "$param_file" ] || [ -z "$location" ]; then
    usage
    exit 1
fi

if [ ! -e "$param_file" ]; then
    echo "Parameter file cannot be read."
    usage
    exit 1
fi

script_dir=$(dirname $0)
deployment_log=./proxy-deployment-log.json

echo "Deploying proxy environment..."
az deployment sub create \
    --template-file $script_dir/main.bicep \
    --location $location \
    --parameters @$param_file > $deployment_log

prefix=$(jq -r .properties.parameters.prefix.value < $deployment_log)
resourceGroup=$(jq -r .properties.parameters.resourceGroupName.value < $deployment_log)

echo "Restricting virtual machine..."
az network nsg rule update \
    --name DenyNonProxyOutbound \
    --nsg-name ${prefix}-restricted-nsg \
    --resource-group ${resourceGroup} \
    --access Deny
