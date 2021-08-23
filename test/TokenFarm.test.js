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
})