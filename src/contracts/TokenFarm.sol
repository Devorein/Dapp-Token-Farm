// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

import './DaiToken.sol';
import './DappToken.sol';

contract TokenFarm {
    string public name = 'Dapp Token Farm';
    DaiToken public daiToken;
    DappToken public dappToken;

    // An array of all the stakers of dai token
    address[] public stakers;
    // Keeps track of the staked balance of the investor
    mapping(address => uint256) public stakingBalance;
    // Keeps track of all the investors that have staked
    mapping(address => bool) public hasStaked;
    // Keeps track of all the investors current staking status
    mapping(address => bool) public isStaking;

    constructor(DaiToken _daiToken, DappToken _dappToken) {
        daiToken = _daiToken;
        dappToken = _dappToken;
    }

    // Transfer dai token from investors wallet to the smart contracts
    function stakeTokens(uint256 _amount) public {
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update the investors staked amount
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add investor to the stakers array if they haven't staked already
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status of the current investor
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }
}
