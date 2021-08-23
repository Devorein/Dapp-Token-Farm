import React, { useEffect } from 'react';
import Web3 from "web3";
import './App.css';
import logo from './logo.svg';

function App() {
  useEffect(() => {
    async function loadWeb3() {
      const _window: any = window;
      if (_window.ethereum) {
        _window.web3 = new Web3(_window.ethereum);
        await _window.ethereum.enable()
      } else if (_window.web3) {
        _window.web3 = new Web3(_window.web3.currentProvider);
      }
    }
    loadWeb3();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
