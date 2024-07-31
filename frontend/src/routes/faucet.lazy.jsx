import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/faucet")({
	component: Faucet,
});

function Faucet() {
	return <div className="p-2">Hello from Faucet!</div>;
}
