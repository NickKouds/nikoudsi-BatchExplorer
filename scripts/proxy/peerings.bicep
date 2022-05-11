param prefix string
param vpnVnetName string
param virtualNetworkName string

resource vpnVnet 'Microsoft.Network/virtualNetworks@2019-11-01' existing = {
  name: vpnVnetName
}

resource vnet 'Microsoft.Network/virtualNetworks@2019-11-01' existing = {
  name: virtualNetworkName
}

resource proxyPeering 'Microsoft.Network/virtualNetworks/virtualNetworkPeerings@2020-07-01' = {
  name: '${prefix}-proxy2vpn'
  parent: vnet
  properties: {
    allowVirtualNetworkAccess: true
    allowForwardedTraffic: true
    allowGatewayTransit: false
    useRemoteGateways: true
    remoteVirtualNetwork: {
      id: vpnVnet.id
    }
  }
}

resource vpnPeering 'Microsoft.Network/virtualNetworks/virtualNetworkPeerings@2020-07-01' = {
  name: '${prefix}-vpn2proxy'
  parent: vpnVnet
  properties: {
    allowVirtualNetworkAccess: true
    allowForwardedTraffic: true
    allowGatewayTransit: true
    useRemoteGateways: true
    remoteVirtualNetwork: {
      id: vnet.id
    }
  }
}
