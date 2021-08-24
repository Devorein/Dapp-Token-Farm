import "../../types/truffle-contracts/types";

const TokenFarm = (global.artifacts as Truffle.Artifacts).require("TokenFarm");
const DaiToken = (global.artifacts as Truffle.Artifacts).require("DaiToken");
const DappToken = (global.artifacts as Truffle.Artifacts).require("DappToken");

module.exports = async function(deployer, network, accounts) {
  deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  deployer.deploy(TokenFarm, daiToken.address, dappToken.address);
  const tokenFarm = await TokenFarm.deployed()

  // Transfer 1 million dapp token to the token farm
  dappToken.transfer(tokenFarm.address, '1000000000000000000000000');

  // Transfer 100 dai token to an investor
  daiToken.transfer(accounts[1], '100000000000000000000');
} as Truffle.Migration;