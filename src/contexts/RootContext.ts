import React from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

export interface IRootContext{
  accounts: string[],
  web3: Web3 | null,
  daiTokenBalance: string | null,
  daiToken: null | Contract
  dappToken: null | Contract,
  dappTokenBalance: null | string,
}

export const RootContext = React.createContext<IRootContext>({} as any);