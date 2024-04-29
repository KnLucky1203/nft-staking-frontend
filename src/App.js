import "./App.css";

import { useState, useEffect } from "react";
import { Web3 } from "web3";
import abi from "./sm_abi.json";

function App() {
  const [connectedAccount, setConnectedAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    getBalance();
  }, [connectedAccount]);

  async function connectMetamask() {
    //check metamask is installed
    if (window.ethereum) {
      // instantiate Web3 with the injected provider
      const web3 = new Web3(window.ethereum);

      //request user to connect accounts (Metamask will prompt)
      await window.ethereum.request({ method: "eth_requestAccounts" });

      //get the connected accounts
      const accounts = await web3.eth.getAccounts();

      //show the first connected account in the react page
      setConnectedAccount(accounts[0]);
    } else {
      alert("Please download metamask");
    }
  }

  const httpProvider = new Web3.providers.HttpProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545/"
  );
  const web3Client = new Web3(httpProvider);

  const tokenAddress = "0x233b8ef63ef104c7c5ded4d80356adff75065ee0";
  // const tokenAddress = "0x9Cc479a479598E7e7f6Fe3C38f35C160006Aa021";
  const contract = new web3Client.eth.Contract(abi, tokenAddress);

  async function getBalance() {
    if (!connectedAccount) return;
    const result = await contract.methods.balanceOf(connectedAccount).call();
    const resultInEther = web3Client.utils.fromWei(result, "ether");
    setBalance(resultInEther);
  }

  async function sendToken() {
    if (!to) {
      alert("Address is empty.");
      return;
    }
    if (amount <= 0) {
      alert("Amout is invalid.");
      return;
    }

    let res = await contract.methods.transfer(to, amount).call();

  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => connectMetamask()}>
          <p style={{ fontSize: "20px" }}>Connect to Wallet</p>
        </button>
        <p>Wallet address: {connectedAccount}</p>
        <p>Current balance: {balance}</p>
        <p>
          To:{" "}
          <input
            style={{ fontSize: "20px" }}
            type="text"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
            }}
          ></input>
        </p>
        <p>
          Amout:{" "}
          <input
            style={{ fontSize: "20px" }}
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          ></input>
        </p>

        <button onClick={() => sendToken()}>
          <p style={{ fontSize: "20px" }}> Send</p>
        </button>
      </header>
    </div>
  );
}

export default App;
