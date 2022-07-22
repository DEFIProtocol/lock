

// fix contractAddress input not being read
// set up on hover additional details for



import React, { useState } from "react";
import { ethers } from "ethers";
import { useEffect } from "react";
import { Typography } from "antd";
//const styles = {
//  chartheader: {
//    display: "flex",
//    color: "black",
//  },
//  charttitle: {
//    color: "black",
//    justifyContent: "spacebetween",
//    display: "flex",
//    position: "absolute",
//    left: "40%",
//    top: "20%",
//    marginRight: "17%",
//  }
//};

function TokenData({ price, contractAddress, ethValue, logo }) {
  const [tokenData, setTokenData] = useState();

  const address = "0x626E8036dEB333b408Be468F951bdB42433cBF18";
  const rpcURL = process.env.INFURA_API_KEY;
  const provider = new ethers.providers.InfuraProvider("mainnet", rpcURL);
  const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    //  "function balanceOf(address) view returns (uint256)",
    //  "function transfer(address, uint256) returns (bool)",
    //  "function transferFrom(address, address, uint256) returns (bool)",
    //   "function approve(address, uint256) returns (bool)",
  ];

  const contract = new ethers.Contract(address, ERC20_ABI, provider);
  console.log(contractAddress);
  console.log(address);

  const marketCapitalization = async () => {
    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();
    const supply = await ethers.utils.formatEther(totalSupply);
    setTokenData({ symbol: symbol, name: name, supply: supply.toLocaleString(), price: price });
    return {
      symbol: symbol,
      name: name,
      supply: supply
    };
  };
  console.log(parseFloat(ethValue))
  console.log(parseInt(ethValue).toFixed(18))

  useEffect(() => {
    marketCapitalization();
  }, []);

  console.log(ethValue);

  if (tokenData == null) return "loading";
  return (
    <>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          textAlign: "left",
          cursor: "pointer",
          position: "absolute",
          top: "10px",
        }}>
        <img
          src={logo}
          style={{
            height: "10vh",
            width: "10vh",
            float: "left",
            marginRight: "2vw",
            alignSelf: "left",

          }}
          alt="No Logo"
        />
        <Typography.Title level={5} style={{ float: "left", marginRight: "5vw", textAlign: "center", marginTop: "3vh" }} >
          {tokenData.name}
        </Typography.Title>
        <div
          style={{
            float: "left",
            left: "35%",
            textAlign: "center",
            marginTop: "1.5vh",
            fontWeight: "bold",
            position: "absolute",
          }}>
          USD <br />
          ${!price ? null :
            price.toLocaleString()}
        </div>
        <div
          style={{
            float: "left",
            left: "45%",
            textAlign: "center",
            marginTop: "1.5vh",
            fontWeight: "bold",
            position: "absolute",
          }}
        >
          ETH<br />
          {!ethValue ? null :
            parseFloat(ethValue) < .00001 ?
              ethValue * (10 ** 18) + "(WEI)" :
              parseFloat(ethValue).toFixed(7)
          }
        </div>
        <div
          style={{
            float: "left",
            left: "60%",
            textAlign: "center",
            marginTop: "1.5vh",
            fontWeight: "bold",
            position: "absolute",
          }}>
          Supply<br />
          {tokenData.supply}
        </div>
        <div
          style={{
            float: "right",
            left: "75%",
            textAlign: "center",
            marginTop: "1.5vh",
            fontWeight: "bold",
            position: "absolute",
          }}>
          MarketCap<br />
          {(tokenData.supply * price).toLocaleString()}
        </div>
      </div>
    </>
  );
}

export default TokenData;
