// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Pool.sol";
import "./interfaces/IPool.sol";
import "hardhat/console.sol";

contract Factory {
    error ZeroAddress(address token);
    error IdenticalAddresses(address token0, address token1);
    error PoolAlreadyExists(address token0, address token1);

    address[] public pools;
    mapping(address => mapping(address => address)) public poolsMap;

    event PoolCreated(
        address indexed token0,
        address indexed token1,
        address poolAddress,
        uint256
    );

    function getPools() external view returns (address[] memory) {
        return pools;
    }

    function createPool(address tokenA, address tokenB) external {
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA); // Formal ordering
        if (token0 == address(0)) revert ZeroAddress(token0);
        if (token1 == address(0)) revert ZeroAddress(token1);
        if (token0 == token1) revert IdenticalAddresses(token0, token1);

        if (poolsMap[token0][token1] != address(0))
            revert PoolAlreadyExists(token0, token1);

        bytes memory bytecode = type(Pool).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        address poolAddress;
        assembly {
            poolAddress := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IPool(poolAddress).initialize(token0, token1);
        pools.push(poolAddress);
        poolsMap[token0][token1] = poolAddress;
        poolsMap[token1][token0] = poolAddress;
        emit PoolCreated(token0, token1, poolAddress, pools.length);
    }
}
