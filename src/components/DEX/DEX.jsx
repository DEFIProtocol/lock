import useInchDex from "hooks/useInchDex";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

function DEX({ chain }) {
  const { tokenList } = useInchDex(chain);
  const { Moralis, isAuthenticated } = useMoralis();
  const [watchlist, setWatchlist] = useState([]);


  console.log(tokenList);

  const getFavorites = async () => {
    if (!isAuthenticated) return null;
    const user = await Moralis.User.current();
    let favorite = user.get("Favorites");
    setWatchlist(favorite);
  };

  const addWatchlist = async (token) => {
    if (!isAuthenticated)
      return alert("You must connect your wallet to add to your watchlist");
    try {
      const user = await Moralis.User.current();
      console.log(user);
      await user.addUnique("Favorites", token);
      await user.save();
      alert("Added to your watchlist!!");
    } catch (error) {
      alert("error" + error.code + error.message);
    }
  };

  const removeWatchlist = async (token) => {
    if (!isAuthenticated) return null;
    try {
      const user = await Moralis.User.current();
      console.log(user);
      await user.remove("Favorites", token);
      await user.save();
      alert("Removed from your watchlist!!");
    } catch (error) {
      alert("error" + error.code + error.message);
    }
  };

  // const newObject = async (tokenName, tokenSymbol, tokenAddress, tokenLogo) => {
  //   const tokensTable = Moralis.Object.extend("Tokens");
  //   const tokens = new tokensTable();
  //   tokens.set("Name", tokenName);
  //   tokens.set("Symbol", tokenSymbol);
  //   tokens.set("Address", tokenAddress);
  //   tokens.set("Logo", tokenLogo);
  //   await tokens.save();
  //   alert("Token added to the list!!");
  // };
  // <button onClick={() => newObject(tokenList[token].name, tokenList[token].symbol, tokenList[token].address, tokenList[token].logoURI)}>
  // add to server
  //</button>

  useEffect(() => {
    getFavorites();
  }, [addWatchlist, removeWatchlist]);

  return (
    <div
      style={{
        width: "100%",
        padding: "15px",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "303030",
      }}
    >
      <h1
        style={{ backgroundColor: "black", color: "lime", textAlign: "center" }}
      >
        Organization Tokens
      </h1>
      {!tokenList
        ? null
        : Object.keys(tokenList).map((token, index) => (
          <div
            style={{
              padding: "5px 20px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            key={index}
          >
            <Card
              style={{
                backgroundColor: "#202020",
                width: "100%",
                color: "lime",
                border: "1px solid #202020",
              }}
            >
              <Link
                to={`/${tokenList[token].name}/${chain}/${tokenList[token].address}`}
              >
                <img
                  style={{
                    height: "32px",
                    width: "32px",
                    marginRight: "20px",
                    float: "left",
                  }}
                  src={tokenList[token].logoURI}
                  alt="noLogo"
                />
                <div style={{ float: "left" }}>
                  <h4 title="Organization" style={{ color: "lime" }}>
                    {tokenList[token].name}
                  </h4>
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "15px",
                      lineHeight: "14px",
                      color: "lime",
                    }}
                  >
                    {tokenList[token].symbol}
                  </span>
                </div>
              </Link>
              {watchlist.includes(tokenList[token].address) ? (
                <StarFilled
                  style={{ float: "right" }}
                  onClick={() => removeWatchlist(tokenList[token].address)}
                />
              ) : (
                <StarOutlined
                  style={{ float: "right" }}
                  onClick={() => addWatchlist(tokenList[token].address)}
                />
              )}
            </Card>
          </div>
        ))}
    </div>
  );
}

export default DEX;
