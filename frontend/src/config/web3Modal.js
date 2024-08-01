import {hardhat, sepolia} from "wagmi/chains";
import {defaultWagmiConfig} from "@web3modal/wagmi/react/config";

export const PROJECT_ID = "b440e50f1f91a5da8d3beacb442ff864";

const metadata = {
    name: "Encode Expert Solidity",
    description: "Group 5 Final Project",
    url: "http://localhost:5174",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [sepolia, hardhat];

export const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId: PROJECT_ID,
    metadata,
});