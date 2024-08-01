import ERC20Mock from '../evm-deployment/ERC20Mock.json';
import { writeContract } from 'viem/actions';
import { parseEther } from 'viem';

export const mintTokens = async (walletClient, tokenAddress, amount) => {
  if (!walletClient) throw new Error('Wallet client not connected');

  const contract = {
    abi: ERC20Mock.abi,
    address: tokenAddress,
  };

  return await writeContract(walletClient, {
    ...contract,
    functionName: 'mint',
    args: [parseEther(`${amount}`)],
  });
};
