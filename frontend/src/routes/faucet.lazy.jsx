import { createLazyFileRoute } from "@tanstack/react-router";
import TokenFaucet from "../components/TokenFaucet";
import { TOKENS } from "../data";

export const Route = createLazyFileRoute("/faucet")({
	component: Faucet,
});

function Faucet() {
	return (
		<div className="mx-auto flex flex-col gap-4" style={{ maxWidth: "1000px" }}>
			{TOKENS.map((token) => (
				<TokenFaucet key={token.address} tokenAddress={token.address} />
			))}
		</div>
	);
}
