import { getStaticPoolConfig} from "../utils/pool.js";
import {useWriteContract, useAccount, usePublicClient} from "wagmi";
import Pool from "../evm-deployment/Pool.json";
import ERC20Mock from "../evm-deployment/ERC20Mock.json";
import {parseEther} from "viem";

export const usePool = (token0, token1) => {
    const account = useAccount();
    const publicClient = usePublicClient();

    function transferBeforeSwap(amountIn, tokenIn) {
        const pool = getStaticPoolConfig(token0, token1);

        if(!account) throw new Error("Account not connected");

        return {
            abi: ERC20Mock.abi,
            address: tokenIn,
            functionName: "transfer",
            args: [pool.address, parseEther(`${amountIn}`)],
        };
    }

    function syncPool() {
        const pool = getStaticPoolConfig(token0, token1);
        if(!account) throw new Error("Account not connected");

        return {
            abi: Pool.abi,
            address: pool.address,
            functionName: "sync",
            args: [],
        };
    }

    function waitUntilTxMined(txHash, confirmations = 1) {
        return publicClient.waitForTransactionReceipt({ hash: txHash, confirmations });
    }

    const useSwap = () => {
        const {isPending, writeContractAsync, error} = useWriteContract();

        return {
            isPending,
            error,
            swap: async(amountIn, tokenIn) => {
                const pool = getStaticPoolConfig(token0, token1);

                if(!account || !publicClient) throw new Error("Account not connected");

                const [amount0Out, amount1Out] = tokenIn === pool.token0 ? [0, amountIn] : [amountIn, 0];

                return await writeContractAsync({
                    abi: Pool.abi,
                    address: pool.address,
                    functionName: "swap",
                    args: [parseEther(`${amount0Out}`), parseEther(`${amount1Out}`), account.address],
                });
            },
            preSwapTransfer: async(amountIn, tokenIn) => {
                return await writeContractAsync(transferBeforeSwap(amountIn, tokenIn));
            },
            syncPool: async() => {
                return await writeContractAsync(syncPool());
            }
        };
    };

    return {
        useSwap,
        waitUntilTxMined
    };
}