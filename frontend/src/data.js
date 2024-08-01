import deployedAddresses from './evm-deployment/deployed_addresses.json';

export const TOKENS = [
  deployedAddresses['MockTokensModule#TokenA'],
  deployedAddresses['MockTokensModule#TokenB'],
  deployedAddresses['MockTokensModule#TokenC'],
];

export const POOLS = [
  {
    token0: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    token1: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    address: '0xFEf48cbd9DDa2952D61265891924CeED9a23448d',
  },
  {
    token0: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    token1: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    address: '0xb2C364963022ef045Fb87C62B22d2D1932E46682',
  },
];
