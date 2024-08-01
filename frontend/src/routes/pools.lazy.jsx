import { createLazyFileRoute } from "@tanstack/react-router";
import { useReadContract } from "wagmi";
import Pool from "../components/Pool";
import Factory from "../evm-deployment/Factory.json";
import deployedAddresses from "../evm-deployment/deployed_addresses.json";

export const Route = createLazyFileRoute("/pools")({
	component: Pools,
});

function Pools() {
	const pools = useReadContract({
		abi: Factory.abi,
		address: deployedAddresses["FactoryModule#Factory"],
		functionName: "getPools",
	});

	return (
		<div className="card mx-auto" style={{ maxWidth: "1000px" }}>
			<table className="w-full">
				<thead>
					<tr className="text-left">
						<th>Pair</th>
						<th>Reserve 0</th>
						<th>Reserve 1</th>
						<th>Actions</th>
					</tr>
					<tr className="border-t border-black border-opacity-20">
						<td className="pb-2"></td>
					</tr>
				</thead>
				<tbody>
					{pools.data?.map((poolAddress) => (
						<Pool key={poolAddress} address={poolAddress} />
					))}
				</tbody>
			</table>
		</div>
	);
}
