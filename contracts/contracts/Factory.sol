// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Pool.sol";
import "hardhat/console.sol";

contract Factory {
    address[] public pools;
    mapping(address => mapping(address => address)) public poolsMap;

    function getPools() external view returns (address[] memory) {
        return pools;
    }

    function createPool(address _token0, address _token1) external {
        require(_token0 != address(0), "token0 address mustn't be the zero address");
        require(_token1 != address(0), "token1 address mustn't be the zero address");
        require(_token0 != _token1, "token0 and token1 addresses mustn't be equal");
        require(_token0 < _token1, "token0 and token1 must be ascendingly sorted by their ERC20 contract addresses");
        require(poolsMap[_token0][_token1] == address(0), "This pool already exists");

        Pool pool = new Pool(_token0, _token1);
        address poolAddress = address(pool);

        pools.push(poolAddress);
        poolsMap[_token0][_token1] = poolAddress;
    }
}
