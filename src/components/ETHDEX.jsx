

// favorites list into one component

import { Link } from "react-router-dom";
import { Card } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import useERC20Tokens from "hooks/useERC20Tokens";

//useMoralisQuery
function ETHDEX() {
  const { Moralis, isAuthenticated } = useMoralis();
  const { tokens } = useERC20Tokens();
  const [watchlist, setWatchlist] = useState([]);
  const [query, setQuery] = useState("");

  console.log(tokens);

  const getFavorites = async () => {
    if (!isAuthenticated) return null;
    const user = await Moralis.User.current();
    let favorite = user.get("Favorites");
    setWatchlist(favorite);
  };

  // look at watchlist / relations and watchlistMetadata function on home page.
  const addWatchlist = async (token) => {
    if (!isAuthenticated)
      return alert("You must connect your wallet to add to your watchlist");
    try {
      const user = await Moralis.User.current();
      //const favorites = user.relation("Watchlist");
      await user.addUnique("Favorites", token);
      await user.save().then(getFavorites());
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
      await user.save().then(getFavorites());
    } catch (error) {
      alert("error" + error.code + error.message);
    }
  };

  useEffect(() => {
    getFavorites();
  }, [addWatchlist, removeWatchlist]);

  //const filteredTokens = () => {
  //  var search = tokens.filter((val) => {
  //    if (query == "") {
  //      return val;
  //    } else {
  //      return val.Name.toLowerCase().includes(query.toLowerCase());
  //      //  && val.Symbol.toLowerCase().includes(query.toLowerCase());
  //    }
  //  });
  //  return search;
  //};

  return (
    <div
      style={{
        width: "100%",
        padding: "15px",
        alignItems: "center",
        alignSelf: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <input
          placeholder="Search..."
          style={{
            margin: "40px auto",
            backgroundColor: "#202020",
            color: "#909090",
            textAlign: "center",
            lineHeight: "2em",
          }}
          type="text"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <h1 style={{ color: "lime", textAlign: "center" }}>Tokens</h1>
      <div style={{ color: "lime" }}>
        <span style={{ float: "left", marginRight: "30%", marginLeft: "10%" }}>
          DAO
        </span>
        <span style={{ float: "left", marginRight: "25%" }}>Type</span>
        <span>Price</span>
      </div>
      <div>
        {!tokens
          ? null
          : tokens
            .filter((val) => {
              if (query == "") {
                return val;
              } else {
                return val.Name.toLowerCase().includes(query.toLowerCase());
                //  && val.Symbol.toLowerCase().includes(query.toLowerCase());
              }
            })
            .map((token, index) => (
              <div
                style={{
                  padding: "5px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                key={index}
              >
                <Card
                  style={{
                    backgroundColor: "#202020",
                    width: "90%",
                    color: "lime",
                    border: "1px solid #202020",
                    margin: "0px auto",
                  }}
                >
                  <Link to={`/${token.Name}/${token.Address}`}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        style={{
                          height: "32px",
                          width: "32px",
                          marginRight: "20px",
                          float: "left",
                        }}
                        src={token.Logo}
                        alt="noLogo"
                      />
                      <div style={{ float: "left" }}>
                        <h4 title="Organization" style={{ color: "lime" }}>
                          {token.Name}
                        </h4>
                        <span
                          style={{
                            fontWeight: "600",
                            fontSize: "15px",
                            lineHeight: "14px",
                            color: "lime",
                            position: "absolute",
                          }}
                        >
                          {token.Symbol}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontWeight: "600",
                            fontSize: "15px",
                            padding: "20px",
                            color: "lime",
                            position: "absolute",
                            left: "40%",
                            float: "top",
                            top: "20%",
                          }}
                        >
                          {token.Type == null ? "--" : token.Type}
                        </span>
                        <span
                          style={{
                            fontWeight: "600",
                            fontSize: "15px",
                            padding: "20px",
                            color: "lime",
                            left: "70%",
                            float: "top",
                            position: "absolute",
                            top: "20%",
                          }}
                        >
                          {token.LastPrice == null ? "--" : token.LastPrice}
                        </span>
                      </div>
                    </div>
                  </Link>
                  {watchlist.includes(token.Address) ? (
                    <StarFilled
                      style={{ float: "right", top: "10%", fontSize: "125%" }}
                      onClick={() => removeWatchlist(token.Address)}
                    />
                  ) : (
                    <StarOutlined
                      style={{ float: "right", top: "10%", fontSize: "125%" }}
                      onClick={() => addWatchlist(token.Address)}
                    />
                  )}
                </Card>
              </div>
            ))}
      </div>
    </div>
  );
}

export default ETHDEX;
