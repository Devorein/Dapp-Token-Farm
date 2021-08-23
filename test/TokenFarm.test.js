const { assert } = require("chai");

const TokenFarm = artifacts.require("TokenFarm");
const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");

require("chai")
  .use(require("chai-as-promised"))
  .should()

function exchangeTokens(token){
  return web3.utils.toWei(token, 'Ether');
}

contract('TokenFarm', ([owner, investor])=>{
  let daiToken, dappToken, tokenFarm;

  before(async ()=> {
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(daiToken.address, dappToken.address);
    
    // Transfer all dapp tokens to token farm
    await dappToken.transfer(tokenFarm.address, exchangeTokens('1000000'));

    // Transfer 100 dai token from owner to the investor
    await daiToken.transfer(investor, exchangeTokens('100'), {from: owner} )
  });

  describe('Mock DAI Deployment', async ()=> {
    it('has a name', async ()=> {
      const name = await daiToken.name();
      assert.equal(name, 'Mock DAI Token')
    })
  })

  describe('Mock Dapp Deployment', async ()=> {
    it('has a name', async ()=> {
      const name = await dappToken.name();
      assert.equal(name, 'DApp Token')
    })
  })

  describe('Token Farm Deployment', async ()=> {
    it('has a name', async ()=> {
      const name = await tokenFarm.name();
      assert.equal(name, 'Dapp Token Farm')
    })

    it(`contact has token`, async ()=> {
      const balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), exchangeTokens('1000000'));
    })
  })

  describe('Farms tokens', () => {
    it('Should check if investor have correct dai token balance before staking', async ()=> {
      // Check the balance of the investor before staking dai token in token farm
      const result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), exchangeTokens('100'), 'Incorrect investor mock dai balance before staking in Token Farm');
    })

    it('Should not stake 0 dai tokens', async()=> {
      // Approve that token farm can stake 100 dai tokens from investors address
      await daiToken.approve(tokenFarm.address, exchangeTokens('100'), {from: investor});
      // Stake investors mock dai tokens
      await tokenFarm.stakeTokens(exchangeTokens('0'), {from: investor}).should.be.rejected;
    })

    it('Should check if investor have correct dai token balance after staking', async()=> {
      // Approve that token farm can stake 100 dai tokens from investors address
      await daiToken.approve(tokenFarm.address, exchangeTokens('100'), {from: investor});
      // Stake investors mock dai tokens
      await tokenFarm.stakeTokens(exchangeTokens('100'), {from: investor});
  
      // Check the balance of the investor after staking dai token
      const result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), exchangeTokens('0'), 'Incorrect investor mock dai balance after staking in Token Farm');
    })

    it('Should check if investor have correct daiToken balance after investor has staked', async()=> {
      // Token farm should have 100 dai token after investor has staked it
      const result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), exchangeTokens('100'), 'Incorrect token farm mock dai balance after investor staked')
    })

    it(`Should check the staking states of TokenFarm after investor has staked`, async ()=> {
      let result;
      // Token farm stakingBalance hashmap should contain correct staked dai token value for the investor
      result = await tokenFarm.stakingBalance(investor);
      assert.equal(result.toString(), exchangeTokens('100'), 'Incorrect staked balance of investor in token farm stakingBalance hashmap');
  
      // Check to see if the investor is in the hasStacked hashmap after staking dai token
      result = await tokenFarm.hasStaked(investor);
      assert.equal(result.toString(), 'true', "Investor hasn't been added in the hasStacked hashmap");
  
      // Check to see if the current investor is currently staking
      result = await tokenFarm.isStaking(investor);
      assert.equal(result.toString(), 'true', 'Investor staked status is incorrect')
    })

    it(`Should issue dapp tokens to investors`, async()=> {
      await tokenFarm.issueTokens({from: owner});
  
      const balance = await dappToken.balanceOf(investor);
      assert.equal(balance.toString(), exchangeTokens('100'), 'Investor should have correct dapp token after issuing')
    })

    it(`Should only issue token from the owner`, async()=> {
      await tokenFarm.issueTokens({from: investor}).should.be.rejected;
    })

    it(`Should check the staking state after unstaking dai tokens`, async()=> {
      await tokenFarm.unstakeTokens({from: investor});
      const balance = await daiToken.balanceOf(investor);
      assert.equal(balance.toString(), exchangeTokens('100'), 'Investor should get the staked dai tokens back to their wallet after unstaking it');

      assert.equal((await daiToken.balanceOf(tokenFarm.address)).toString(), exchangeTokens('0'), 'Investor should get the staked dai tokens back to their wallet after unstaking it');

      const isStaking = await tokenFarm.isStaking(investor);
      assert.equal(isStaking, false, 'Investor should not be staking after unstaking');
      
      const stakingBalance = await tokenFarm.stakingBalance(investor);
      assert.equal(stakingBalance.toString(), exchangeTokens('0'), 'Investor should not have any staked dai tokens after unstaking')
    })
  })
})