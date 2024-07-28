// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract Pool {
    address public factory;
    address public token0;
    address public token1;

    constructor(address _token0, address _token1) {
        factory = msg.sender;
        token0 = _token0;
        token1 = _token1;
    }

    function approve(bool isToken1, uint amount) external {
        // TODO
    }

    function deposit(bool isToken1, uint amount) external {
        // TODO
    }

    function swap(
        bool inputIsToken1,
        uint inputAmount
        // uint outputTargetAmount
    ) external {
        // TODO
    }
}
