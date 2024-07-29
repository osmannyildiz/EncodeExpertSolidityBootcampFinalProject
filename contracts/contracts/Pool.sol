// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Pool is ERC20 {
    error NotFactory();

    address public factory;
    address public token0;
    address public token1;

    uint112 private reserve0;
    uint112 private reserve1;
    uint32 private blockTimestampLast;

    // Internal price, updated every block 
    uint256 public price0ComulativeLast;
    uint256 public price1ComulativeLast;

    event Mint(address indexed sender, uint256 reserve0, uint256 reserve1);
    event Burn(address indexed sender, uint256 reserve0, uint256 reserve1);
    event Swap(address indexed sender, uint256 amount0Out, uint256 amount1Out, address to);
    event Sync(uint256 reserve0, uint256 reserve1);

    constructor() ERC20("LP Token", "LP") {
        factory = msg.sender;
    }

    function initialize(address _token0, address _token1) external {
        if (msg.sender != factory) revert NotFactory();
        token0 = _token0;
        token1 = _token1;
    }

    // Calulates amount of LP token to min based on deposits
    function mint(address to) public returns (uint256 liquidity) {
        emit Mint();  
    }

    // Calulates amount of LP token to burn based on withdrawals
    function burn() public returns (uint256 amount0, uint256 amount1) {
        emit Burn();
    }

    function swap(
        bool inputIsToken1,
        uint inputAmount
        // uint outputTargetAmount
    ) external {
        // TODO
    }

    function sync() public {
        (uint256 reserve0_, uint256 reserve1_, ) = getReserves();
        _update(
            IERC20(token0).balanceOf(address(this)),
            IERC20(token1).balanceOf(address(this)),
            reserve0_,
            reserve1_
        );
    }

    // Update reserves and updates price once per block
    function _update(uint balance0, uint balance1, uint112 _reserve0, uint112 _reserve1) private {
    }

    function getReserves() public view returns (uint256, uint256 , uint32) {
        return (reserve0, reserve1, blockTimestampLast);
    }

    function approve(bool isToken1, uint amount) external {
        // TODO
    }

    function deposit(bool isToken1, uint amount) external {
        // TODO
    }
}
