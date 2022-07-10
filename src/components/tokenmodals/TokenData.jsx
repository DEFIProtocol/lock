import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Web3 from "web3";

function TokenData({ contractAddress, contractABI, usdPrice }) {
  const { Moralis } = useMoralis();
  const [block, setBlock] = useState();
  const [supply, setSupply] = useState();
  const [price, setPrice] = useState(usdPrice);
  const [marketCap, setMarketCap] = useState();

  console.log(contractABI);

  const web3Node = async () => {
    await Moralis.enableWeb3();
    var web3 = new Web3(
      new Web3.providers.HttpProvider(
        "https://speedy-nodes-nyc.moralis.io/e0b5800131e142a5b8dbb709/eth/mainnet/archive",
        { timeout: 100000 },
      ),
    );
    try {
      web3.eth.getBlockNumber().then((blockNumber) => {
        setBlock(blockNumber);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    web3Node().then(
      () => setPrice(usdPrice),
      getTotalSupply(contractAddress, contractABI),
    );
  }, [contractAddress, contractABI]);

  const getTotalSupply = async () => {
    var web3 = new Web3(
      new Web3.providers.HttpProvider(
        "https://speedy-nodes-nyc.moralis.io/e0b5800131e142a5b8dbb709/bsc/mainnet",
        { timeout: 100000 },
      ),
    );
    try {
      var contract = await new web3.eth.Contract(contractABI, contractAddress);
      contract.methods
        .totalSupply()
        .call({}, block)
        .then((res) => {
          var circulatingSupply = res / 1000000000000000000;
          console.log(price);
          console.log(usdPrice);
          var mkCap = circulatingSupply * parseFloat(usdPrice);
          setSupply(circulatingSupply.toLocaleString());
          setMarketCap(mkCap.toLocaleString());
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div>
        <div style={{ color: "lime", display: "block" }}>
          Total Supply
          <div style={{ color: "lime" }}>{supply}</div>
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
        <div>$ {marketCap}</div>
      </div>
    </div>
  );
}

export default TokenData;
