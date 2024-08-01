// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface IPool {
    error NotFactory();
    error ReentrancyGuard();
    error Mint_InsufficientLiquidity();
    error Burn_InsufficientLiquidity();
    error Swap_InsufficientLiquidity();
    error Swap_InvalidOutAmount();
    error Swap_InvalidTo();
    error Swap_InsufficientInputAmount();
    error InvalidK();

    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function price0CumulativeLast() external view returns (uint256);
    function price1CumulativeLast() external view returns (uint256);
    function INITIAL_BURN_AMOUNT() external view returns (uint256);

    function initialize(address _token0, address _token1) external;
    function mint(address to) external returns (uint256 liquidity);
    function burn(address to) external returns (uint256 amount0, uint256 amount1);
    function swap(uint256 amount0Out, uint256 amount1Out, address to) external;
    function sync() external;
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);

    event Mint(address indexed sender, uint256 reserve0, uint256 reserve1);
    event Burn(address indexed sender, uint256 reserve0, uint256 reserve1);
    event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to);
    event Sync(uint256 reserve0, uint256 reserve1);
}
