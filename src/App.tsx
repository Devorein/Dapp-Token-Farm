import React, { useEffect, useState } from 'react';
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import DaiTokenJson from "./abis/DaiToken.json";
import './App.css';
import { Network } from './types';

function App() {
  const [state, setState] = useState<{
    accounts: string[],
    web3: Web3 | null,
    daiTokenBalance: string | null,
    daiToken: null | Contract
  }>({
    accounts: [],
    web3: null,
    daiTokenBalance: null,
    daiToken: null
  })

  useEffect(() => {
    async function loadWeb3() {
      const web3 = new Web3("http://127.0.0.1:7545")
      const accounts = await web3.eth.getAccounts()
      const networkId = await web3.eth.net.getId();
      const daiTokenData = (DaiTokenJson.networks as any)[networkId] as Network
      if (daiTokenData) {
        const daiToken = new web3.eth.Contract(DaiTokenJson.abi as any as AbiItem, daiTokenData.address)
        const daiTokenBalance = await daiToken.methods.balanceOf(accounts[0]).call()
        setState({
          web3,
          accounts,
          daiToken,
          daiTokenBalance: daiTokenBalance.toString()
        })
      }

    }
    loadWeb3();
  }, [])

  return (
    <div className="App">

    </div>
  );
}

export default App;
