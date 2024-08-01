import { useWalletInfo, useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { shortenAddress } from "../utils";

function ConnectWalletButton() {
	const { open: openModal } = useWeb3Modal();
	const { walletInfo } = useWalletInfo();
	const { address } = useAccount();

	if (address) {
		return (
			<button
				type="button"
				className="px-3 py-2 bg-white bg-opacity-40 hover:bg-opacity-70 rounded-xl transition-all flex gap-2"
				onClick={() => openModal()}
			>
				{walletInfo && (
					<img src={walletInfo.icon} alt={walletInfo.name} className="h-6" />
				)}
				<span className="font-medium">{shortenAddress(address)}</span>
			</button>
		);
	} else {
		return (
			<button
				type="button"
				className="btn-primary px-3 py-2"
				onClick={() => openModal()}
			>
				Connect Wallet
			</button>
		);
	}
}

export default ConnectWalletButton;
