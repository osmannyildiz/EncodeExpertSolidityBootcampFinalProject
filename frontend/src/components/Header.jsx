import { Link } from "@tanstack/react-router";
import ConnectWalletButton from "./ConnectWalletButton";

function Header() {
	return (
		<header>
			<div className="fixed top-0 left-0 right-0 h-20 px-6 flex justify-between items-center">
				<span className="text-2xl font-medium">FiveSwap</span>
				<ConnectWalletButton />
			</div>
			<nav className="navbar fixed top-0 left-0 right-0 h-20 flex justify-center items-center gap-4">
				<Link
					to="/"
					className="[&.active]:font-bold [&.active]:bg-opacity-40 px-3 py-2 bg-white bg-opacity-10 rounded-xl transition-all"
				>
					Swap
				</Link>
				<Link
					to="/pools"
					className="[&.active]:font-bold [&.active]:bg-opacity-40 px-3 py-2 bg-white bg-opacity-10 rounded-xl transition-all"
				>
					Pools
				</Link>
				<Link
					to="/faucet"
					className="[&.active]:font-bold [&.active]:bg-opacity-40 px-3 py-2 bg-white bg-opacity-10 rounded-xl transition-all"
				>
					Faucet
				</Link>
				<Link
					to="/debug"
					className="[&.active]:font-bold [&.active]:bg-opacity-40 px-3 py-2 bg-white bg-opacity-10 rounded-xl transition-all"
				>
					🐸 Debug
				</Link>
			</nav>
		</header>
	);
}

export default Header;
