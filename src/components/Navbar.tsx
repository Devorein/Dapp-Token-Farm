import React, { useContext } from "react";
import { RootContext } from "../contexts";

export function Navbar() {
  const { accounts } = useContext(RootContext);
  return <div className="Navbar">
    {accounts[0]}
  </div>
}