import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import TokenOption from "../components/TokenOption";
import { TOKENS } from "../data";

export const Route = createLazyFileRoute("/")({
	component: Swap,
});

function Swap() {
	const [sellTokenAddress, setSellTokenAddress] = useState(TOKENS[0]);
	const [buyTokenAddress, setBuyTokenAddress] = useState(TOKENS[1]);
	const [sellAmount, setSellAmount] = useState("0");
	const [buyAmount, setBuyAmount] = useState("0");

	useEffect(() => {
		// TODO Calculate buy amount
		setBuyAmount(sellAmount);
	}, [sellTokenAddress, buyTokenAddress, sellAmount, buyAmount]);

	const onSubmit = async (event) => {
		event.preventDefault();

		// TODO

		console.log("hey done");
	};

	return (
		<div className="card mx-auto" style={{ maxWidth: "600px" }}>
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
							{TOKENS.map((tokenAddress) => (
								<TokenOption key={tokenAddress} tokenAddress={tokenAddress} />
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
							{TOKENS.filter(
								(tokenAddress) => tokenAddress !== sellTokenAddress
							).map((tokenAddress) => (
								<TokenOption key={tokenAddress} tokenAddress={tokenAddress} />
							))}
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

				<button type="submit" className="btn-primary px-4 py-4 text-3xl">
					Swap!
				</button>
			</form>
		</div>
	);
}
