import './App.css';
import {contract} from './utils/contract'
import {abi} from './utils/abi'
import { useEffect, useState } from 'react';
import {ethers} from 'ethers'

function App() {
  const [walletConnected, isWalletConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [total, setTotal] = useState("");
  const [symbol,setSymbol] = useState("");
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [transferTo, setTransferTo] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [transFerValue, setTransferValue] = useState("");
  let chainId;


  const connectWallet = async() =>{
    try {
      if (window.ethereum) {
        chainId = await window.ethereum.request({method: 'eth_chainId'});
        if (Number(chainId) !== 4) {
          alert("Please switch to rinkeby")
          return
        }
        const getAccount = await window.ethereum.request({method:'eth_requestAccounts'});
        const accounts = getAccount[0];
        setAccount(accounts)
        isWalletConnected(true);
        console.log("Account is:",accounts);
        // getTokenInfo();
      }
      else{
        setError("Please connect to metamask")
        alert(error)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getTotalSupply = async() =>{
    try {
      if (window.ethereum) {
        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        const signer = provider.getSigner();
        const memeContract = new ethers.Contract(contract,abi,provider);
        const totalSupply = await memeContract.totalSupply();
        const realSupply = totalSupply.toString()
        setTotal(realSupply);
        console.log("Total supply is:", total);

      } else {
        setError("Please connect to metamask")
        console.log(error);
      }
    } catch (error) {
      console.log();
    }
  }

const getSymbol = async() =>{
 try {
   if (window.ethereum) {
    //const provider = new ethers.providers.Web3Provider(window.ethereum);
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
    //const signer = provider.getSigner()
    const memeContract = new ethers.Contract(contract,abi,provider)
    const symbol = await memeContract.symbol();
    setSymbol(`${symbol} 🦊`)
    console.log("symbol is:", symbol);
   } else {
     alert("set put metamask")
   }
 } catch (error) {
   console.log(error);
 }
}

const getOwner = async () =>{
  try {
    if (window.ethereum) {
      //const provider = new ethers.providers.Web3Provider(window.ethereum);
      const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      const signer = provider.getSigner();
      const memeContract = new ethers.Contract(contract,abi,provider);
      const owner = await memeContract.owner();
      setOwner(owner);
      console.log("Owner is:", owner);   
    } else {
      alert("connect to metamask")
    }
  } catch (error) {
    console.log(error);
  }
}

const getName = async() =>{
  try {
    if (window.ethereum) {
      const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      //const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const memeContract = new ethers.Contract(contract,abi,provider);
      const name = await memeContract.name()
      setName(name);
      console.log("Contract name:", name);
    } else {
      console.log("install metamask");
    }
  } catch (error) {
    console.log(error);
  }
}

  const checkOwner = async() =>{
    if (owner.toLowerCase() === account.toLowerCase()) {
      setIsOwner(true)
    }
  }

  const valueHandler = ({target}) =>{
    switch (target.id) {
      case "to":
        setTransferTo(target.value)
        break;
    
      case "value":
        setTransferValue(target.value)
        break;
    
      case "amount":
        setBurnAmount(target.value)
        break;
    
      default:
        break;
    }
  }

  const setTransfer = async (e) =>{
    e.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const memeContract = new ethers.Contract(contract,abi,signer);
        const transfer = await memeContract.mint(transferTo,transFerValue);
        console.log("...transferring");
        await transfer.wait()
        console.log("transferred");
        console.log(transfer.hash);
      } else {
        console.log("Connect metamask");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const burn = async(e) =>{
    e.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const memeContract = new ethers.Contract(contract,abi,signer);
        const burnTokens = await memeContract.burn(burnAmount);
        console.log("burning...");
        burnTokens.wait()
        console.log("Tokens burnt");
        console.log(burnTokens.hash);
        getTotalSupply();
      } else {
        alert("Connect metamask");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(
    ()=>{
      getOwner();
      getName();
      getSymbol();
      getTotalSupply();
      checkOwner();
    },[chainId]
  )

  return (
    <div className="App">
        <div className='header'>
          <h1>Meme Coin Project 💰</h1>
        </div>
      <div className='wrapper'>
        <div className='detail'>
          <p>Coin: {name}</p>
          <p>Ticker: {symbol}</p>
          <p>Total supply: {Number(total).toLocaleString("en-US")}</p>
        </div>
        <div className='forms'>
          <form onSubmit={setTransfer}>
            <input type="text" name="" id="to" placeholder='wallet address' onChange={valueHandler}/>
            <input type="text" name="" id="value" placeholder='0.000FXC' onChange={valueHandler}/>
            <button>transfer tokens</button>
          </form>
          <form onSubmit={burn}>
            <input type="text" name="" id="amount" placeholder='0.000FXC'onChange={valueHandler}/>
            <button disabled={isOwner}>burn tokens</button>
          </form>
        </div>
        <div className='extras'>
          <p>Contract Address:{contract}</p>
          <p>Token owner address:{owner}</p>
          <p>Your wallet address:{account}</p>
          <button onClick={connectWallet}>
           {walletConnected ? 
           <p>wallet connected 🔒</p>
             : 
            <p>connect wallet 🔑</p>
            }
          </button>
        </div>
      </div>
    </div>
  );

}

export default App
