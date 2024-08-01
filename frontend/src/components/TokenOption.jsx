import { useReadContract } from "wagmi";
import ERC20Mock from "../evm-deployment/ERC20Mock.json";

function TokenOption({ tokenAddress }) {
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
		<option value={tokenAddress}>
			{tokenName.data} ({tokenSymbol.data})
		</option>
	);
}

export default TokenOption;
