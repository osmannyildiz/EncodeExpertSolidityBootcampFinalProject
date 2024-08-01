// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC20Mock} from "./ERC20Mock.sol";

contract TokenB is ERC20Mock {
    constructor() ERC20Mock("Token B", "TKB") {}
}
