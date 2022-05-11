@description('The prefix for deployment resources')
param prefix string

@description('The location of the deployment')
param location string = resourceGroup().location

@description('VM Size')
param vmSize string = 'Standard_D2s_v3'

@description('Proxy port')
param proxyPort string = '8080'

@description('VM Username')
param username string

@description('VM Password')
@secure()
param password string

resource networkSecurityGroup 'Microsoft.Network/networkSecurityGroups@2019-11-01' = {
  name: '${prefix}-nsg'
  location: location
  properties: {
    securityRules: [
      {
        name: 'Allow Special HTTP Ports'
        properties: {
          description: 'Only allow HTTP traffic to proxy'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: proxyPort
          sourceAddressPrefix: '80'
          destinationAddressPrefix: openSubnet.properties.addressPrefix
          access: 'Allow'
          priority: 100
          direction: 'Outbound'
        }
      }
      {
        name: 'Restrict HTTP'
        properties: {
          description: 'Deny all other HTTP traffic'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '80'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          access: 'Deny'
          priority: 200
          direction: 'Outbound'
        }
      }
      {
        name: 'Allow RDP'
        properties: {
          description: 'Allow RDP into host'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '3389'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 300
          direction: 'Inbound'
        }
      }
    ]
  }
}

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2019-11-01' = {
  name: '${prefix}-vnet'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
  }
}

resource restrictedSubnet 'Microsoft.Network/virtualNetworks/subnets@2021-08-01' = {
  parent: virtualNetwork
  name: '${prefix}-restricted-subnet'
  properties: {
    addressPrefix: '10.0.0.0/24'
  }
}

resource openSubnet 'Microsoft.Network/virtualNetworks/subnets@2021-08-01' = {
  parent: virtualNetwork
  name: '${prefix}-open-subnet'
  properties: {
    addressPrefix: '10.0.1.0/24'
  }
}

resource networkInterface 'Microsoft.Network/networkInterfaces@2021-08-01' = {
  name: '${prefix}-netinterface'
  location: location
  properties: {
    ipConfigurations: [
      {
        name: 'ipconfig1'
        properties: {
          privateIPAddress: '192.168.0.4'
          privateIPAllocationMethod: 'Dynamic'
          subnet: {
            id: restrictedSubnet.id
          }
          primary: true
          privateIPAddressVersion: 'IPv4'
        }
      }
    ]
    enableAcceleratedNetworking: true
    enableIPForwarding: false
    networkSecurityGroup: {
      id: networkSecurityGroup.id
    }
  }
}

var vmName = '${prefix}-vm'

resource virtualMachine 'Microsoft.Compute/virtualMachines@2020-12-01' = {
  name: vmName
  location: location
  properties: {
    networkProfile: {
      networkInterfaces: [
        {
          id: networkInterface.id
        }
      ]
    }
    osProfile: {
      computerName: vmName
      adminUsername: username
      adminPassword: password
    }
    storageProfile: {
      imageReference: {
        publisher: 'MicrosoftWindowsDesktop'
        offer: 'Windows-10'
        sku: 'win10-21h2-pro-g2'
        version: 'latest'
      }
      osDisk: {
        osType: 'Windows'
        name: '${prefix}-vmdisk'
        createOption: 'FromImage'
        caching: 'ReadWrite'
        diskSizeGB: 127
      }
    }
    hardwareProfile: {
      vmSize: vmSize
    }
  }
}

resource windowsVMExtensions 'Microsoft.Compute/virtualMachines/extensions@2020-12-01' = {
  parent: virtualMachine
  name: '${prefix}-vmext'
  location: location
  properties: {
    publisher: 'Microsoft.Compute'
    type: 'CustomScriptExtension'
    typeHandlerVersion: '1.10'
    autoUpgradeMinorVersion: true
    settings: {
      fileUris: [
        'https://raw.githubusercontent.com/Azure/BatchExplorer/shpaster/proxy-config/scripts/proxy/downloadBatchExplorer.ps1'
      ]
    }
    protectedSettings: {
      commandToExecute: 'powershell -ExecutionPolicy Bypass -file downloadBatchExplorer.ps1'
    }
  }
}

output virtualMachineId string = virtualMachine.id
