// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Pool.sol";
import "hardhat/console.sol";

contract Factory {
    error ZeroAddressNotAllowed(address token);
    error IdenticalAddressesNotAllowed(address token0, address token1);
    error AddressesNotInAscendingOrder(address token0, address token1);
    error PoolAlreadyExists(address token0, address token1);

    address[] public pools;
    mapping(address => mapping(address => address)) public poolsMap;

    function getPools() external view returns (address[] memory) {
        return pools;
    }

    function createPool(address _token0, address _token1) external {
        if (_token0 == address(0)) revert ZeroAddressNotAllowed(_token0);
        if (_token1 == address(0)) revert ZeroAddressNotAllowed(_token1);
        if (_token0 == _token1) revert IdenticalAddressesNotAllowed(_token0, _token1);
        if (_token0 > _token1) revert AddressesNotInAscendingOrder(_token0, _token1);
        if (poolsMap[_token0][_token1] != address(0)) revert PoolAlreadyExists(_token0, _token1);

        Pool pool = new Pool(_token0, _token1);
        address poolAddress = address(pool);

        pools.push(poolAddress);
        poolsMap[_token0][_token1] = poolAddress;
    }
}
