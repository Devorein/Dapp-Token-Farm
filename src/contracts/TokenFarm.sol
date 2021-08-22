// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

import './DaiToken.sol';
import './DappToken.sol';

contract TokenFarm {
    string public name = 'Dapp Token Farm';
    DaiToken public daiToken;
    DappToken public dappToken;

    constructor(DaiToken _daiToken, DappToken _dappToken) {
        daiToken = _daiToken;
        dappToken = _dappToken;
    }
}
