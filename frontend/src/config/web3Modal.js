import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { hardhat, sepolia } from 'wagmi/chains';

export const PROJECT_ID = 'b440e50f1f91a5da8d3beacb442ff864';

const metadata = {
  name: 'Encode Expert Solidity',
  description: 'Group 5 Final Project',
  url: 'http://localhost:5173',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [sepolia, hardhat];

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: PROJECT_ID,
  metadata,
});
