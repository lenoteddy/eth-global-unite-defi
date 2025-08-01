import { type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
	getDefaultConfig({
		// Your dApps chains
		chains: [mainnet],
		transports: {
			// RPC URL for each chain
			[mainnet.id]: http(`https://eth.llamarpc.com`),
		},
		// Required API Keys
		walletConnectProjectId: "b9934b90eb97346cd875d07d557ed9f0",
		// Required App Info
		appName: "Your App Name",
		// Optional App Info
		appDescription: "Your App Description",
		appUrl: "https://family.co", // your app's url
		appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
	})
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<ConnectKitProvider>{children}</ConnectKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};
