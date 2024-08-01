import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import "./main.css";
import { routeTree } from "./routeTree.gen";
import {PROJECT_ID, wagmiConfig} from "./config/web3Modal.js";

const router = createRouter({ routeTree });

const queryClient = new QueryClient();

createWeb3Modal({
	wagmiConfig,
	projectId: PROJECT_ID,
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
