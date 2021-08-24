import React, { useEffect, useState } from 'react';
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import DaiTokenJson from "./abis/DaiToken.json";
import DappTokenJson from "./abis/DappToken.json";
import './App.css';
import { Navbar } from './components';
import { RootContext } from './contexts';
import { Network } from './types';

function App() {
  const [state, setState] = useState<{
    accounts: string[],
    web3: Web3 | null,
    daiTokenBalance: string | null,
    daiToken: null | Contract,
    dappToken: null | Contract,
    dappTokenBalance: null | string,
  }>({
    accounts: [],
    web3: null,
    daiTokenBalance: null,
    daiToken: null,
    dappToken: null,
    dappTokenBalance: null
  })

  useEffect(() => {
    async function loadWeb3() {
      const web3 = new Web3("http://127.0.0.1:7545");
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const daiTokenData = (DaiTokenJson.networks as any)[networkId] as Network;
      const dappTokenData = (DappTokenJson.networks as any)[networkId] as Network;
      if (daiTokenData && dappTokenData) {
        const daiToken = new web3.eth.Contract(DaiTokenJson.abi as any as AbiItem, daiTokenData.address);
        const dappToken = new web3.eth.Contract(DappTokenJson.abi as any as AbiItem, dappTokenData.address);
        const daiTokenBalance = await daiToken.methods.balanceOf(accounts[0]).call(),
          dappTokenBalance = await dappToken.methods.balanceOf(accounts[0]).call();
        setState({
          web3,
          accounts,
          daiToken,
          daiTokenBalance: daiTokenBalance.toString(),
          dappToken,
          dappTokenBalance
        })
      }
    }
    loadWeb3();
  }, [])

  console.log(state)

  return (
    <RootContext.Provider value={state}>
      <div className="App">
        <Navbar />
      </div>
    </RootContext.Provider>
  );
}

export default App;
