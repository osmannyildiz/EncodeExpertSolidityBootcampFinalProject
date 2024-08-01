import { createLazyFileRoute } from "@tanstack/react-router";
import { useWriteContract } from "wagmi";
import { TOKENS } from "../data";
import Factory from "../evm-deployment/Factory.json";
import deployedAddresses from "../evm-deployment/deployed_addresses.json";

export const Route = createLazyFileRoute("/debug")({
	component: Debug,
});

function Debug() {
	const { isPending, writeContract, error } = useWriteContract();

	return (
		<div className="card mx-auto" style={{ maxWidth: "1000px" }}>
			<div className="mb-4">
				<h1 className="text-2xl font-medium">Create Pool</h1>
				<button
					type="button"
					disabled={isPending}
					className="btn-primary px-3 py-2"
					onClick={() => {
						writeContract({
							abi: Factory.abi,
							address: deployedAddresses["FactoryModule#Factory"],
							functionName: "createPool",
							args: [TOKENS[0].address, TOKENS[1].address],
						});
					}}
				>
					{isPending ? "wait..." : "click me"}
				</button>
				<p style={{ color: "red" }}>{error?.message}</p>
			</div>

			<div className="mb-4">
				<h1 className="text-2xl font-medium">Deposit into a Pool</h1>
				<p>TODO</p>
			</div>

			<div className="mb-4">
				<h1 className="text-2xl font-medium">Swap</h1>
				<p>TODO</p>
			</div>
		</div>
	);
}
