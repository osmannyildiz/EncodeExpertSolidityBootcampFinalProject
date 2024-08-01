import deployedAddresses from "./evm-deployment/deployed_addresses.json";

// TODO Make this a string[]
export const TOKENS = [
	{
		address: deployedAddresses["MockTokensModule#TokenA"],
		name: "Token A",
		symbol: "TKA",
	},
	{
		address: deployedAddresses["MockTokensModule#TokenB"],
		name: "Token B",
		symbol: "TKB",
	},
	{
		address: deployedAddresses["MockTokensModule#TokenC"],
		name: "Token C",
		symbol: "TKC",
	},
];
