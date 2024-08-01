import { encodePacked, getContractAddress, keccak256 } from 'viem';
import Pool from '../evm-deployment/Pool.json';
import { POOLS } from '../data.js';

export const derivePoolAddress = (token0, token1) => {
  const salt = getSalt(token0, token1);

  console.log(salt);

  return getContractAddress({
    opcode: 'CREATE2',
    bytecode: Pool.bytecode,
    salt,
    from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  });
};

function getSalt(token0, token1) {
  const [tokenA, tokenB] =
    token0 < token1 ? [token0, token1] : [token1, token0];

  return keccak256(encodePacked(['address', 'address'], [tokenA, tokenB]));
}

// Workaround until `derivePoolAddress` works as expected
export const getStaticPoolAddress = (token0, token1) => {
  return getStaticPoolConfig(token0, token1).address;
};

export const getStaticPoolConfig = (token0, token1) => {
  const searchArgsForward = [token0, token1];
  const searchArgsBackward = [token1, token0];

  const pool = POOLS.find((pool) => {
    const poolArgs = [pool.token0, pool.token1];

    return (
      poolArgs.toString() === searchArgsForward.toString() ||
      poolArgs.toString() === searchArgsBackward.toString()
    );
  });

  if (!pool) throw new Error('Pool not configured');
  return pool;
};
