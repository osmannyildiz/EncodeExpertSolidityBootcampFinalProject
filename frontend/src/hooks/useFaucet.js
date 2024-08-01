import { useWriteContract } from 'wagmi';
import ERC20Mock from '../evm-deployment/ERC20Mock.json';
import { parseEther } from 'viem';

export const useFaucet = (tokenAddress) => {
  const { writeContract, ...others } = useWriteContract();

  const mint = (amount) => {
    writeContract({
      abi: ERC20Mock.abi,
      address: tokenAddress,
      functionName: 'mint',
      args: [parseEther(`${amount}`)],
    });
  };

  return {
    mint,
    ...others,
  };
};
