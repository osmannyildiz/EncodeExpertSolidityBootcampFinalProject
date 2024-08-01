// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IPool} from "./interfaces/IPool.sol";
import "hardhat/console.sol";

/// @notice Pool takes no fees
contract Pool is IPool, ERC20 {
    uint256 public INITIAL_BURN_AMOUNT = 1000;

    address public factory;
    address public token0;
    address public token1;

    uint112 private reserve0;
    uint112 private reserve1;
    uint32 private blockTimestampLast;

    // Price for time-weighted average price oracle
    // Updates with each pool state update
    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;

    uint private unlocked = 1;
    modifier nonReentrant() {
        if (unlocked != 1) revert ReentrancyGuard();
        unlocked = 2;
        _;
        unlocked = 1;
    }

    constructor() ERC20("LP Token", "LP") {
        factory = msg.sender;
    }

    function initialize(address _token0, address _token1) external {
        if (msg.sender != factory) revert NotFactory();
        token0 = _token0;
        token1 = _token1;
    }

    // Calculates amount of LP token to mint based on deposits
    function mint(
        address to
    ) external nonReentrant returns (uint256 liquidity) {
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves();
        // Checks balances of token0 and token1 held in pool
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        // The difference between balances and reserves are the amounts deposited by user
        uint256 amount0 = balance0 - _reserve0;
        uint256 amount1 = balance1 - _reserve1;

        if (totalSupply() == 0) {
            liquidity = Math.sqrt(amount0 * amount1) - INITIAL_BURN_AMOUNT;
            // Workaround to burn INITIAL_BURN_AMOUNT
            _mint(to, liquidity + INITIAL_BURN_AMOUNT);
            _burn(to, INITIAL_BURN_AMOUNT);
        } else {
            liquidity = Math.min(
                (amount0 * totalSupply()) / _reserve0,
                (amount1 * totalSupply()) / _reserve1
            );
        }

        if (liquidity == 0) revert Mint_InsufficientLiquidity();
        _mint(to, liquidity);

        _update(balance0, balance1, _reserve0, _reserve1);

        emit Mint(msg.sender, amount0, amount1);
    }

    // Calculates amount of LP token to burn based on withdrawals
    function burn(
        address to
    ) external nonReentrant returns (uint256 amount0, uint256 amount1) {
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves();
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        // The pool's balance of LP tokens
        uint256 liquidity = balanceOf(address(this));

        uint256 totalSupply_ = totalSupply();
        amount0 = (liquidity * balance0) / totalSupply_;
        amount1 = (liquidity * balance1) / totalSupply_;

        if (amount0 <= 0 || amount1 <= 0) revert Burn_InsufficientLiquidity();
        _burn(address(this), liquidity);
        IERC20(token0).transfer(to, amount0);
        IERC20(token1).transfer(to, amount1);

        balance0 = IERC20(token0).balanceOf(address(this));
        balance1 = IERC20(token1).balanceOf(address(this));

        _update(balance0, balance1, _reserve0, _reserve1);

        emit Burn(msg.sender, amount0, amount1);
    }

    /// @notice Not supporting flash swaps
    function swap(
        uint256 amount0Out,
        uint256 amount1Out,
        address to
    ) external nonReentrant {
        if (amount0Out == 0 && amount1Out == 0) revert Swap_InvalidOutAmount();
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves();
        if (amount0Out > _reserve0 || amount1Out > _reserve1)
            revert Swap_InsufficientLiquidity();

        address _token0 = token0;
        address _token1 = token1;
        if (to == _token0 || to == _token1) revert Swap_InvalidTo();
        if (amount0Out > 0) IERC20(_token0).transfer(to, amount0Out);
        if (amount1Out > 0) IERC20(_token1).transfer(to, amount1Out);

        uint balance0 = IERC20(_token0).balanceOf(address(this));
        uint balance1 = IERC20(_token1).balanceOf(address(this));

        uint amount0In = balance0 > _reserve0 - amount0Out
            ? balance0 - (_reserve0 - amount0Out)
            : 0;
        uint amount1In = balance1 > _reserve1 - amount1Out
            ? balance1 - (_reserve1 - amount1Out)
            : 0;
        if (amount0In == 0 && amount1In == 0)
            revert Swap_InsufficientInputAmount();

        assembly {
            let balance0Adjusted := balance0
            let balance1Adjusted := balance1
            let reserve0_ := _reserve0
            let reserve1_ := _reserve1
            if lt(
                mul(balance0Adjusted, balance1Adjusted),
                mul(reserve0_, reserve1_)
            ) {
                mstore(0x00, 0xbd8bc364) // keccak256("InvalidK()")
                revert(0x00, 0x20)
            }
        }

        _update(balance0, balance1, _reserve0, _reserve1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    // Allows anyone to update the pool's state
    function sync() public {
        (uint112 reserve0_, uint112 reserve1_, ) = getReserves();
        _update(
            IERC20(token0).balanceOf(address(this)),
            IERC20(token1).balanceOf(address(this)),
            reserve0_,
            reserve1_
        );
    }

    // Update reserves and updates price once per block
    function _update(
        uint256 balance0,
        uint256 balance1,
        uint112 _reserve0,
        uint112 _reserve1
    ) private {
        uint32 blockTimestamp = uint32(block.timestamp % 2 ** 32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast;
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            // Perform UQ112x112 fixed point arithmetic ie. (reserveA * 2^112) / reserveB
            uint256 price0 = (uint256(_reserve1) << 112) / _reserve0;
            uint256 price1 = (uint256(_reserve0) << 112) / _reserve1;
            assembly {
                let slot0 := price0CumulativeLast.slot
                let slot1 := price1CumulativeLast.slot
                sstore(slot0, add(sload(slot0), mul(price0, timeElapsed)))
                sstore(slot1, add(sload(slot1), mul(price1, timeElapsed)))
            }
        }
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserve0, reserve1);
    }

    function getReserves() public view returns (uint112, uint112, uint32) {
        return (reserve0, reserve1, blockTimestampLast);
    }
}
