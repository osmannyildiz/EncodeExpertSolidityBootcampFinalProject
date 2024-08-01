import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TOKENS } from "../data";
import {usePool} from "../hooks/usePool.js";

export const Route = createLazyFileRoute("/")({
	component: Swap,
});

function Swap() {
	const [sellTokenAddress, setSellTokenAddress] = useState(TOKENS[0].address);
	const [buyTokenAddress, setBuyTokenAddress] = useState(TOKENS[1].address);
	const [sellAmount, setSellAmount] = useState("0");
	const [buyAmount, setBuyAmount] = useState("0");

	const {useSwap, waitUntilTxMined} = usePool(sellTokenAddress, buyTokenAddress);
	const {swap, error: swapError, isPending: isSwapPending, preSwapTransfer} = useSwap();

	useEffect(() => {
		// TODO Calculate buy amount
		setBuyAmount(sellAmount);
	}, [sellTokenAddress, buyTokenAddress, sellAmount, buyAmount]);

	useEffect(() => {
		console.log({
			swapError
		})
	}, [swapError]);

	const onSubmit = async (event) => {
		event.preventDefault();

		if(sellAmount === "0") return;

		try {
			const transferTxHash = await preSwapTransfer(sellAmount, sellTokenAddress);

			const receipt = await waitUntilTxMined(transferTxHash);

			if(receipt.status === 'success') {
				console.log("Transfer successful");

				const txHash = await swap(sellAmount, sellTokenAddress);
				const swapReceipt = await waitUntilTxMined(txHash);

				if(swapReceipt.status === 'success') {
					console.log("Swap successful");
				}
			}
		} catch (error) {
			// TODO Handle error
		}
	};

	return (
		<div className="card mx-auto max-w-[600px]">
			<form className="flex flex-col gap-8" onSubmit={onSubmit}>
				<div className="flex flex-col gap-2">
					<div className="flex justify-between items-end">
						<label htmlFor="sell--amount" className="text-3xl">
							Sell
						</label>
						<select
							name="sellToken"
							id="sell--token"
							value={sellTokenAddress}
							onChange={(event) => setSellTokenAddress(event.target.value)}
							className="token-select"
						>
							{TOKENS.map((token) => (
								<option key={token.address} value={token.address}>
									{token.name}
								</option>
							))}
						</select>
					</div>
					<input
						type="text"
						name="sellAmount"
						id="sell--amount"
						value={sellAmount}
						onChange={(event) =>
							setSellAmount(event.target.value.replaceAll(/[^\d.]/g, ""))
						}
						className="bg-transparent border border-black border-opacity-20 rounded-xl text-5xl px-4 py-2 self-stretch"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<div className="flex justify-between items-end">
						<label htmlFor="buy--amount" className="text-3xl">
							Buy
						</label>
						<select
							name="buyToken"
							id="buy--token"
							value={buyTokenAddress}
							onChange={(event) => setBuyTokenAddress(event.target.value)}
							className="token-select"
						>
							{TOKENS.filter((token) => token.address !== sellTokenAddress).map(
								(token) => (
									<option key={token.address} value={token.address}>
										{token.name}
									</option>
								)
							)}
						</select>
					</div>
					<input
						type="text"
						name="buyAmount"
						id="buy--amount"
						value={buyAmount}
						onChange={(event) =>
							setBuyAmount(event.target.value.replaceAll(/[^\d.]/g, ""))
						}
						className="bg-black bg-opacity-10 border border-black border-opacity-20 rounded-xl text-5xl px-4 py-2 self-stretch cursor-not-allowed"
						disabled
					/>
				</div>

				<button
					type="submit"
					className="bg-amber-700 text-white rounded-xl px-4 py-4 text-3xl hover:bg-amber-800 transition-colors"
				>
					{isSwapPending ? "Swapping..." : "Swap!"}
				</button>
			</form>
		</div>
	);
}
