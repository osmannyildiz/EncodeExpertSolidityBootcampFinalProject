import { createLazyFileRoute } from '@tanstack/react-router';
import { useReadContract, useWriteContract } from 'wagmi';
import Factory from '../evm-deployment/Factory.json';
import deployedAddresses from '../evm-deployment/deployed_addresses.json';

export const Route = createLazyFileRoute('/debug')({
  component: Debug,
});

function Debug() {
  const { isPending, writeContract, error } = useWriteContract();

  const pools = useReadContract({
    abi: Factory.abi,
    address: deployedAddresses['FactoryModule#Factory'],
    functionName: 'getPools',
  });

  return (
    <>
      <h1>Create Pool</h1>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          writeContract({
            abi: Factory.abi,
            address: deployedAddresses['FactoryModule#Factory'],
            functionName: 'createPool',
            args: [
              '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
              '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
            ],
          });
        }}
      >
        {isPending ? 'wait...' : 'click me'}
      </button>
      <p style={{ color: 'red' }}>{error?.message}</p>

      <h1>Pools</h1>
      <button
        type="button"
        disabled={pools.isFetching}
        onClick={() => pools.refetch()}
      >
        {pools.isFetching ? 'wait...' : 'refetch'}
      </button>
      <ul>
        {pools.data?.map((pool) => (
          <li key={pool}>{pool}</li>
        ))}
      </ul>

      <h1>Deposit into a Pool</h1>
      <p>TODO</p>

      <h1>Swap</h1>
      <p>TODO</p>
    </>
  );
}
