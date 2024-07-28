// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Pair.sol";
import "hardhat/console.sol";

contract Factory {
    address[] public pairs;
    mapping(address => mapping(address => address)) public pairsMap;

    function createPair(address _token0, address _token1) external {
        require(_token0 != address(0), "token0 address mustn't be the zero address");
        require(_token1 != address(0), "token1 address mustn't be the zero address");
        require(_token0 != _token1, "token0 and token1 addresses mustn't be equal");
        require(_token0 < _token1, "token0 and token1 must be ascendingly sorted by their ERC20 contract addresses");
        require(pairsMap[_token0][_token1] == address(0), "This pair already exists");

        Pair pair = new Pair(_token0, _token1);
        address pairAddress = address(pair);

        pairs.push(pairAddress);
        pairsMap[_token0][_token1] = pairAddress;
    }
}
