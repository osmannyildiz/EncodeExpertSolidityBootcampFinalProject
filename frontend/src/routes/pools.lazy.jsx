import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/pools")({
	component: Pools,
});

function Pools() {
	return <div className="p-2">Hello from Pools!</div>;
}
