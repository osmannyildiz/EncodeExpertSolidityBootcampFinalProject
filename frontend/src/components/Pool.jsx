import { useReadContract } from "wagmi";
import ERC20Mock from "../evm-deployment/ERC20Mock.json";
import PoolContract from "../evm-deployment/Pool.json";

function Pool({ address }) {
	const token0Address = useReadContract({
		abi: PoolContract.abi,
		address,
		functionName: "token0",
	});
	const token1Address = useReadContract({
		abi: PoolContract.abi,
		address,
		functionName: "token1",
	});
	const reserves = useReadContract({
		abi: PoolContract.abi,
		address,
		functionName: "getReserves",
	});

	const token0Name = useReadContract({
		abi: ERC20Mock.abi,
		address: token0Address.data,
		functionName: "name",
	});
	const token1Name = useReadContract({
		abi: ERC20Mock.abi,
		address: token1Address.data,
		functionName: "name",
	});

	const token0Symbol = useReadContract({
		abi: ERC20Mock.abi,
		address: token0Address.data,
		functionName: "symbol",
	});
	const token1Symbol = useReadContract({
		abi: ERC20Mock.abi,
		address: token1Address.data,
		functionName: "symbol",
	});

	return (
		<tr>
			<td className="pb-2">
				{token0Name.data} &lt;---&gt; {token1Name.data}
			</td>
			<td className="pb-2">
				{Number(reserves.data?.[0])} {token0Symbol.data}
			</td>
			<td className="pb-2">
				{Number(reserves.data?.[1])} {token1Symbol.data}
			</td>
			{/* <td className="pb-2">
				<button
					type="button"
					className="btn-primary px-3 py-2"
					onClick={() => console.log("TODO Add liquidity")}
				>
					Add Liquidity
				</button>
			</td> */}
		</tr>
	);
}

export default Pool;
