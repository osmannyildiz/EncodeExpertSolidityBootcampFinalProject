import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";
import "./main.css";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

const queryClient = new QueryClient();

const projectId = "b440e50f1f91a5da8d3beacb442ff864";

const metadata = {
	name: "Encode Expert Solidity",
	description: "Group 5 Final Project",
	url: "http://localhost:5174",
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [sepolia, hardhat];
const wagmiConfig = defaultWagmiConfig({
	chains,
	projectId,
	metadata,
});

createWeb3Modal({
	wagmiConfig,
	projectId,
	themeMode: "light",
	themeVariables: {
		"--w3m-border-radius-master": "0.6px",
	},
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<WagmiProvider config={wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</WagmiProvider>
	</React.StrictMode>
);
