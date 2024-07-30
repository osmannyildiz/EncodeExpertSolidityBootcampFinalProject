import { createLazyFileRoute } from "@tanstack/react-router";
import { TOKENS } from "../data";

export const Route = createLazyFileRoute("/")({
	component: Swap,
});

function Swap() {
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
							className="px-3 py-2 bg-transparent border border-black border-opacity-20 rounded-xl text-lg"
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
						className="bg-transparent border border-black border-opacity-20 rounded-xl text-5xl px-4 py-2 self-stretch"
						value={123}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<div className="flex justify-between">
						<label htmlFor="buy--amount" className="text-3xl">
							Buy
						</label>
						<select
							name="buyToken"
							id="buy--token"
							className="px-3 py-2 bg-transparent border border-black border-opacity-20 rounded-xl text-lg"
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
						name="buyAmount"
						id="buy--amount"
						className="bg-transparent border border-black border-opacity-20 rounded-xl text-5xl px-4 py-2 self-stretch"
						value={123}
					/>
				</div>

				<button
					type="submit"
					className="bg-amber-700 text-white rounded-xl px-4 py-4 text-3xl hover:bg-amber-800 transition-colors"
				>
					Swap!
				</button>
			</form>
		</div>
	);
}
