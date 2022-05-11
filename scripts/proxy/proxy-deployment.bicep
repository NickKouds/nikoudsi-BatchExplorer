@description('The prefix for deployment resources')
param prefix string

@description('The location of the deployment')
param location string = resourceGroup().location

@description('VM Size')
param vmSize string = 'Standard_D2s_v3'

@description('Proxy port')
param proxyPort string = '3128'

@description('VM Username')
param username string

@description('VM Password')
@secure()
param password string

@description('VM size for proxy server')
param proxyVmSize string = vmSize

@description('Public key data for proxy server')
param proxyPublicKey string

@description('A virtual network with a VPN gateway')
param vpnVnetName string

@description('The Batch Explorer build to fetch (e.g., "2.14.0-insider.602")')
param batchExplorerBuild string

param internalIpAddressRange string = '10.0.0.0/16'
param defaultSubnetAddressPrefix string = '10.0.100.0/24'
param proxySubnetAddressPrefix string = '10.0.101.0/24'
param vnetAddressPrefixes array = [
  internalIpAddressRange
]

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2019-11-01' = {
  name: '${prefix}-vnet'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: vnetAddressPrefixes
    }
  }
}

resource defaultSubnet 'Microsoft.Network/virtualNetworks/subnets@2021-08-01' = {
  name: 'default'
  parent: virtualNetwork
  properties: {
    addressPrefix: defaultSubnetAddressPrefix
  }
}

resource proxySubnet 'Microsoft.Network/virtualNetworks/subnets@2021-08-01' = {
  name: 'proxy'
  parent: virtualNetwork
  properties: {
    addressPrefix: proxySubnetAddressPrefix
  }
}

resource proxyNsg 'Microsoft.Network/networkSecurityGroups@2019-11-01' = {
  name: '${prefix}-open-nsg'
  location: location
  properties: {
    securityRules: [
      {
        name: 'SSH-RDP'
        properties: {
          description: 'Allow SSH & RDP into host'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRanges: [
            '22'
            '3389'
          ]
          sourceAddressPrefix: internalIpAddressRange
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 100
          direction: 'Inbound'
        }
      }
      {
        name: 'AllowHTTPAndHTTPSOutbound'
        properties: {
          description: 'Allow HTTP/S from host'
          protocol: 'Tcp'
          sourcePortRanges: [
            '80'
            '443'
          ]
          destinationPortRanges: [
            '80'
            '443'
          ]
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 101
          direction: 'Outbound'
        }
      }
    ]
  }
}

resource lockedDownNsg 'Microsoft.Network/networkSecurityGroups@2019-11-01' = {
  name: '${prefix}-locked-down-nsg'
  location: location
  properties: {
    securityRules: [
      {
        name: 'AllowSSHAndRDP'
        properties: {
          description: 'Allow SSH & RDP into host'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRanges: [
            '22'
            '3389'
          ]
          sourceAddressPrefix: internalIpAddressRange
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 100
          direction: 'Inbound'
        }
      }
      {
        name: 'AllowProxy'
        properties: {
          description: 'Allow access to proxy server'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: proxyPort
          sourceAddressPrefix: '*'
          destinationAddressPrefix: proxyServerIp
          access: 'Allow'
          priority: 101
          direction: 'Outbound'
        }
      }
      {
        name: 'DenyNonProxyOutbound'
        properties: {
          description: 'Deny outbound access to all traffic'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '*'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 102
          direction: 'Outbound'
        }
      }
    ]
  }
}

module proxyServer './proxy-server.bicep' = {
  name: '${prefix}-proxyServer'
  params: {
    prefix: prefix
    location: location
    subnetId: proxySubnet.id
    nsgId: proxyNsg.id
    username: username
    vmSize: proxyVmSize
    publicKey: proxyPublicKey
    proxyPort: proxyPort
  }
}

var proxyServerIp = proxyServer.outputs.ipAddress

module virtualMachine './virtual-machine.bicep' = {
  name: '${prefix}-virtualMachine'
  params: {
    prefix: prefix
    location: location
    subnetId: defaultSubnet.id
    nsgId: lockedDownNsg.id
    vmSize: vmSize
    username: username
    password: password
    proxyServer: proxyServerIp
    proxyPort: proxyPort
    batchExplorerBuild: batchExplorerBuild
  }
}

module peerings './peerings.bicep' = {
  name: '${prefix}-peerings'
  params: {
    virtualNetworkName: virtualNetwork.name
    vpnVnetName: vpnVnetName
    prefix: prefix
  }
}

output virtualMachineId string = virtualMachine.outputs.id
