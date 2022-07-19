import React, { useState } from "react";
import { ethers } from "ethers";
import { useEffect } from "react";
import { Typography } from "antd";

const styles = {
  chartheader: {
    display: "flex",
    justifyContent: "space-between",
    color: "lime",
    height: "100%",
  },
  charttitle: {
    color: "lime",
  },
};

function TokenData({ price, contractAddress, ethValue }) {
  const [tokenData, setTokenData] = useState();

  const address = "0x626E8036dEB333b408Be468F951bdB42433cBF18";
  const rpcURL = process.env.INFURA_API_KEY;
  const provider = new ethers.providers.InfuraProvider('mainnet', rpcURL);
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


  const contract = new ethers.Contract(address, ERC20_ABI, provider);
  console.log(contract)

  const marketCapitalization = async () => {
    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();
    const supply = await ethers.utils.formatEther(totalSupply);
    setTokenData({ symbol: symbol, name: name, supply: supply, price: price });
    return { symbol: symbol, name: name, supply: supply };
  }

  useEffect(() => {
    marketCapitalization();
  }, [])

  console.log(tokenData.symbol);
  if (tokenData == null) return "loading";
  return (
    <>
      <div>
        <img
          src={tokenData.symbol}
          style={{
            height: "50px",
            width: "50px",
            marginRight: "20px",
            float: "left",
          }}
          alt="No Logo"
        />
        <Typography.Title level={4} style={styles.charttitle}>
          {tokenData.name}
        </Typography.Title>
        <Typography.Title level={5} style={styles.charttitle}>
          Current Price: ${price}
        </Typography.Title>
        <Typography.Title
          level={5}
          style={{ marginLeft: "30%", color: "lime" }}
        >
          ETH/{tokenData.name} : {ethValue}
        </Typography.Title>
        <div style={{ color: "lime", display: "block" }}>
          Total Supply
          <div style={{ color: "lime" }}>{tokenData.supply}</div>
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
        <div>{tokenData.supply * price}</div>
      </div>
    </>
  );
}

export default TokenData;
