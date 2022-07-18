import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";


function TokenData(address) {
  const [tokenData, setTokenData] = useState();
  const rpcURL = process.env.INFURA_RPC_NODE;
  const provider = new ethers.providers.JsonRpcProvider(rpcURL);
  const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    //  "function balanceOf(address) view returns (uint256)",
    //  "function transfer(address, uint256) returns (bool)",
    //  "function transferFrom(address, address, uint256) returns (bool)",
    //   "function approve(address, uint256) returns (bool)",
  ]

  const contract = new ethers.Contract(address.address, ERC20_ABI, provider);

  const marketCapitalization = async () => {
    const totalSupply = await contract.totalSupply();
    const symbol = await contract.symbol();
    const name = await contract.name();
    const decimals = await contract.decimals();
    const supply = ethers.utils.formatUnits(totalSupply, decimals);
    const marketCap = ethers.utils.formatEther(supply);
    setTokenData({ marketCap, symbol, name, supply });
  }
  marketCapitalization();
  console.log(tokenData)



  return (
    <div>
      <div>
        <div style={{ color: "lime", display: "block" }}>
          Total Supply
          <div style={{ color: "lime" }}></div>
        </div>
      </div>
      <div
        style={{
          display: "block",
          color: "lime",
          position: "absolute",
          left: "50%",
        }}
      >
        <div></div>
      </div>
    </div>
  );
}

export default TokenData;
