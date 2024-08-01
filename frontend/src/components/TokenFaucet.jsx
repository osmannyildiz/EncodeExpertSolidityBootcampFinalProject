import { useReadContract, useWriteContract } from "wagmi";
import ERC20Mock from "../evm-deployment/ERC20Mock.json";

function TokenFaucet({ tokenAddress }) {
	const { writeContract } = useWriteContract();

	const tokenName = useReadContract({
		abi: ERC20Mock.abi,
		address: tokenAddress,
		functionName: "name",
	});
	const tokenSymbol = useReadContract({
		abi: ERC20Mock.abi,
		address: tokenAddress,
		functionName: "symbol",
	});

	return (
		<div className="p-4 bg-white bg-opacity-40 rounded-xl flex justify-between items-center">
			<div>
				<span className="font-bold">{tokenName.data}</span> @ {tokenAddress}
			</div>
			<div>
				<button
					type="button"
					className="btn-primary px-3 py-2"
					onClick={() =>
						writeContract({
							abi: ERC20Mock.abi,
							address: tokenAddress,
							functionName: "mint",
							args: [1000e18],
						})
					}
				>
					Get 1000 {tokenSymbol.data}
				</button>
			</div>
		</div>
	);
}

export default TokenFaucet;
