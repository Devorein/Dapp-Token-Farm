// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

import './DaiToken.sol';
import './DappToken.sol';

contract TokenFarm {
    string public name = 'Dapp Token Farm';
    DaiToken public daiToken;
    DappToken public dappToken;
    address public owner;

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
        owner = msg.sender;
    }

    // Transfer dai token from investors wallet to the smart contracts
    function stakeTokens(uint256 _amount) public {
        // Should avoid investors staking 0 tokens
        require(_amount > 0, "Can't stake 0 dai tokens");

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

    // Issue dapp tokens to the investors
    function issueTokens() public {
        require(
            msg.sender == owner,
            'Dapp Tokens can only be issued by the owner'
        );
        // Loop through all the current stakers and issue dapp tokens to them
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            // Get the amount of daitokens they are staking in order ot issue them the same amount of dapptoken
            uint256 balance = stakingBalance[recipient];
            // Issue token only if the balance is greater than 0, as for withdrawal the balance can be negative, negative dapptokens cant be issued
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
}
