import { useMoralis, useERC20Balances } from "react-moralis";
import { Skeleton, Table, Card } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { getEllipsisTxt } from "../helpers/formatters";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useERC20Tokens from "hooks/useERC20Tokens";

function Home(props) {
  const { tokens } = useERC20Tokens();
  const { data: assets } = useERC20Balances(props);
  const { Moralis, isAuthenticated } = useMoralis();
  const [watchlist, setWatchlist] = useState();

  const getFavorites = async () => {
    if (!Moralis && !isAuthenticated) return null;
    const user = await Moralis.User.current();
    let favorite = user.get("Favorites");
    setWatchlist(favorite);
  };

  console.log(watchlist);

  useEffect(() => {
    getFavorites();
  });

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

  const columns = [
    {
      title: "",
      dataIndex: "logo",
      key: "logo",
      render: (logo) => (
        <img
          src={logo || "https://etherscan.io/images/main/empty-token.png"}
          alt="nologo"
          width="28px"
          height="28px"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (symbol) => symbol,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (value, item) =>
        parseFloat(Moralis?.Units?.FromWei(value, item.decimals)).toFixed(6),
    },
    {
      title: "Address",
      dataIndex: "token_address",
      key: "token_address",
      render: (address) => getEllipsisTxt(address, 5),
    },
  ];

  return (
    <div style={{ width: "90%", padding: "15px" }}>
      <h1 style={{ color: "lime" }}>Investments</h1>
      <Skeleton loading={!assets}>
        <Table
          dataSource={assets}
          columns={columns}
          rowKey={(record) => {
            return record.token_address;
          }}
        />
      </Skeleton>
      <div>
        <h1 style={{ color: "lime", marginTop: "20px" }}>Watchlist</h1>

        {!tokens
          ? null
          : Object.keys(tokens).map((token, index) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              key={index}
            >
              {!watchlist.includes(tokens[token].Address) ? null : (
                <Card
                  style={{
                    backgroundColor: "#202020",
                    width: "100%",
                    color: "lime",
                    border: "1px solid #202020",
                    margin: "5px auto",
                  }}
                >
                  <Link
                    to={`/${tokens[token].Name}/${tokens[token].Address}`}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        style={{
                          height: "32px",
                          width: "32px",
                          marginRight: "20px",
                          float: "left",
                        }}
                        src={tokens[token].Logo}
                        alt="noLogo"
                      />
                      <div style={{ float: "left" }}>
                        <h4 title="Organization" style={{ color: "lime" }}>
                          {tokens[token].Name}
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
                          {tokens[token].Symbol}
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
                          {tokens[token].Type == null
                            ? "--"
                            : tokens[token].Type}
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
                          {tokens[token].LastPrice == null
                            ? "--"
                            : tokens[token].LastPrice}
                        </span>
                      </div>
                    </div>
                  </Link>
                  {watchlist.includes(tokens[token].Address) ? (
                    <StarFilled
                      style={{
                        float: "right",
                        top: "10%",
                        margin: "10px",
                        fontSize: "125%",
                      }}
                      onClick={() => removeWatchlist(tokens[token].Address)}
                    />
                  ) : (
                    <StarOutlined
                      style={{
                        float: "right",
                        top: "10%",
                        margin: "10px",
                        fontSize: "125%",
                      }}
                      onClick={() => addWatchlist(tokens[token].Address)}
                    />
                  )}
                </Card>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
export default Home;
