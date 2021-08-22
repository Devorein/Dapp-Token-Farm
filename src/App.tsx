import React, { useState } from 'react';
import './App.css';
import { Navbar } from './components';

function App() {
  const [account, setAccount] = useState('0x0');

  return (
    <div className="App">
      <Navbar account={account} />
      Hello World
    </div>
  );
}

export default App;
