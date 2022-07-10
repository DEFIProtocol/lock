import React, { useEffect, useState } from "react";
import {
  useMoralisWeb3Api,
  useMoralis,
  useMoralisCloudFunction,
} from "react-moralis";
import { useParams } from "react-router-dom";
import { Card, Typography } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import ReactPlayer from "react-player";
import {
  LineChart,
  TokenData,
  AddAnnouncementModal,
  TokenGallery,
  AddPhotos,
  Announcements,
  Order,
  AddVideo,
} from "./tokenmodals";
import { Image } from "cloudinary-react";
// import useInchDex from "hooks/useInchDex";

const { Title } = Typography;

function Token() {
  const [isOpen, setIsOpen] = useState(false);
  const [galleryIsOpen, setGalleryIsOpen] = useState(false);
  const [addPhotosIsOpen, setAddPhotosIsOpen] = useState(false);
  const [tokenMetaData, setTokenMetaData] = useState();
  const [orders, setOrders] = useState();
  const [tokenPrice, setTokenPrice] = useState();
  const [ethValue, setEthValue] = useState();
  const [userAddress, setUserAddress] = useState();
  const { address } = useParams();
  const Web3Api = useMoralisWeb3Api();
  const { Moralis, user, isAuthenticated } = useMoralis();
  const [watchlist, setWatchlist] = useState([]);
  const { fetch } = useMoralisCloudFunction(
    "getTokens",
    { token: "sum" },
    { autoFetch: false },
  );

  const getTokens = async () => {
    fetch({
      onSuccess: (sum) =>
        setTokenMetaData(sum.filter((token) => token.Address == address).pop()),
      onError: (error) => console.log(error),
    });
  };

  useEffect(() => {
    getTokens();
  }, []);

  const getFavorites = async () => {
    if (!isAuthenticated) return null;
    const user = await Moralis.User.current();
    let favorite = user.get("Favorites");
    setWatchlist(favorite);
  };

  useEffect(() => {
    getFavorites();
  }, []);

  const getOrders = async () => {
    if (!isAuthenticated) return null;
    const user = await Moralis.User.current();
    let orders = user.get("Orders");
    setOrders(orders);
  };
  console.log(orders);

  useEffect(() => {
    getOrders();
  }, []);

  const addWatchlist = async (token) => {
    if (!isAuthenticated)
      return alert("You must connect your wallet to add to your watchlist");
    try {
      const user = await Moralis.User.current();
      console.log(user);
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

  const updatePrice = async () => {
    const tokens = Moralis.Object.extend("Tokens");
    const query = new Moralis.Query(tokens);
    query.equalTo("Address", `${address}`);
    const updateToken = await query.first();
    updateToken.set("LastPrice", tokenPrice);
    updateToken.save();
    return updateToken;
  };

  const fetchTokenPrice = async () => {
    const options = await {
      address: address,
      chain: tokenMetaData?.Chain,
    };
    const price = await Web3Api.token.getTokenPrice(options);
    const ethPrice = price.nativePrice.value / 1000000000000000000;
    setEthValue(`${ethPrice}`);
    setTokenPrice(`${price.usdPrice.toLocaleString()}`).then(updatePrice());
  };

  useEffect(() => {
    fetchTokenPrice();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setUserAddress(user.attributes.ethAddress);
    }
  }, [isAuthenticated]);

  // cancel order
  const cancelOrder = async (orderTotal) => {
    const orders = Moralis.Object.extend("Orders");
    const query = new Moralis.Query(orders);
    query.equalTo("orderTotal", orderTotal);
    const result = await query.first();
    if (result) {
      result.destroy(),
        (error) => {
          console.log(error);
        };
    }
  };

  const cancelUserOrder = async (order) => {
    try {
      const user = await Moralis.User.current();
      console.log(order);
      await user.remove("Order", order);
      await user.save().then(getOrders());
    } catch (err) {
      console.log(err);
    }
  };

  // update description
  const updateDescription = () => {
    var description = prompt("New Description");
    if (description != null) {
      updateAccountDescription(description).then(
        alert("Your organization description has been changed!"),
      );
    }
  };

  const updateAccountDescription = async (description) => {
    const tokens = Moralis.Object.extend("Tokens");
    const query = new Moralis.Query(tokens);
    query.equalTo("Address", `${address}`);
    const updateToken = await query.first();
    updateToken.set("Description", description);
    await updateToken.save();
    return updateToken.then(getTokens());
  };

  // update description
  const updateWebsite = () => {
    var website = prompt("Company Url");
    if (website != null) {
      updateAccountWebsite(website).then(
        alert("Your organization description has been changed!"),
      );
    }
  };

  const updateAccountWebsite = async (website) => {
    const tokens = Moralis.Object.extend("Tokens");
    const query = new Moralis.Query(tokens);
    query.equalTo("Address", `${address}`);
    const updateToken = await query.first();
    updateToken.set("Website", website);
    await updateToken.save();
    return updateToken.then(getTokens());
  };

  //update token type
  const updateTokenType = () => {
    const type = prompt(
      "Token types should be classified as a Utility, Stablecoin, Payment, and Security",
    );
    if (type != null) {
      updateAccountType(type).then(
        alert("Your organization description has been changed!"),
      );
    }
  };

  const updateAccountType = async (type) => {
    const tokens = Moralis.Object.extend("Tokens");
    const query = new Moralis.Query(tokens);
    query.equalTo("Address", `${address}`);
    const updateToken = await query.first();
    updateToken.set("Type", type);
    await updateToken.save();
    return updateToken.then(getTokens());
  };

  // AAVE address 0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "lime",
        width: "100%",
        marginTop: "10px",
        display: "block",
      }}
    >
      <Card
        style={{
          width: "43%",
          float: "right",
          position: "relative",
          backgroundColor: "#202020",
          borderRadius: "0.5rem",
          margin: "5px auto",
          border: "1px solid #202020",
        }}
      >
        <Order
          address={address}
          name={tokenMetaData?.Name}
          symbol={tokenMetaData?.Symbol}
          logo={tokenMetaData?.Logo}
          chain={tokenMetaData?.Chain}
          price={tokenPrice}
          ethValue={ethValue}
          renderOrder={() => getOrders()}
        />
      </Card>

      <Card
        style={{
          width: "55%",
          margin: "5px",
          padding: "10px",
          float: "left",
          border: "1px solid #202020",
          borderRadius: "0.5rem",
          backgroundColor: "#202020",
        }}
      >
        {watchlist.includes(address) ? (
          <StarFilled
            style={{ float: "right", color: "lime", fontSize: "150%" }}
            onClick={() => removeWatchlist(address)}
          />
        ) : (
          <StarOutlined
            style={{ float: "right", color: "lime", fontSize: "150%" }}
            onClick={() => addWatchlist(address)}
          />
        )}
        <LineChart
          logo={tokenMetaData?.Logo}
          address={address}
          currentPrice={tokenPrice}
          ethValue={ethValue}
          tokenName={tokenMetaData?.Name}
          chain={tokenMetaData?.Chain}
        />
      </Card>

      <Card
        style={{
          width: "43%",
          float: "right",
          backgroundColor: "#202020",
          borderRadius: "0.5rem",
          margin: "5px auto",
          border: "1px solid #202020",
        }}
      >
        <Title level={3} style={{ color: "lime", margin: "0px auto" }}>
          Description
        </Title>
        <span style={{ color: "lime" }}>Token Type: {tokenMetaData?.Type}</span>
        {userAddress == address ? (
          <button
            onClick={updateTokenType}
            style={{
              backgroundColor: "lime",
              borderRadius: "0.5rem",
              border: "3px solid black",
            }}
          >
            Edit Token Type
          </button>
        ) : null}
        <span style={{ color: "#909090", float: "left", paddingTop: "10px" }}>
          {tokenMetaData?.Description}
        </span>
        <span>
          {userAddress == address ? (
            <button
              onClick={updateDescription}
              style={{
                position: "relative",
                backgroundColor: "lime",
                borderRadius: "0.5rem",
                border: "3px solid black",
              }}
            >
              Edit Description
            </button>
          ) : null}
        </span>
      </Card>

      <Card
        style={{
          width: "43%",
          float: "right",
          backgroundColor: "#202020",
          borderRadius: "0.5rem",
          margin: "5px auto",
          border: "1px solid #202020",
        }}
      >
        <Title level={3} style={{ color: "lime", margin: "0px auto" }}>
          Website
        </Title>
        <a style={{ color: "lime" }} href={tokenMetaData?.Website}>
          {tokenMetaData?.Website}
        </a>
        <span>
          {userAddress == address ? (
            <button
              onClick={updateWebsite}
              style={{
                backgroundColor: "lime",
                borderRadius: "0.5rem",
                border: "3px solid black",
              }}
            >
              Edit Company Website
            </button>
          ) : null}
        </span>
      </Card>

      <Card
        style={{
          width: "55%",
          margin: "5px",
          padding: "10px",
          float: "left",
          border: "1px solid #202020",
          borderRadius: "0.5rem",
          backgroundColor: "#202020",
        }}
      >
        <TokenData
          contractAddress={tokenMetaData?.contractAddress}
          contractABI={tokenMetaData?.contractABI}
          usdPrice={tokenPrice}
        />
      </Card>

      {!tokenMetaData?.ProfilePic &&
      !tokenMetaData?.Video &&
      !tokenMetaData?.Pictures ? null : (
        <Card
          style={{
            width: "43%",
            height: "auto",
            float: "right",
            backgroundColor: "#202020",
            borderRadius: "0.5rem",
            margin: "5px auto",
            border: "1px solid #202020",
            display: "flex",
          }}
        >
          <div>
            {!tokenMetaData?.Video ? (
              <Image
                publicId={tokenMetaData?.ProfilePic}
                cloudName="gridlock"
                style={{ width: "80%", height: "80%" }}
              />
            ) : (
              <div
                style={{ width: "100%", position: "relative", height: "auto" }}
              >
                <ReactPlayer
                  controls
                  url={tokenMetaData?.Video}
                  width="34.2vw"
                  height="20.5vw"
                />
              </div>
            )}
          </div>
          <span
            style={{
              color: "DeepSkyBlue",
              align: "center",
              position: "relative",
              margin: "0px auto",
            }}
            onClick={() => setGalleryIsOpen(true)}
          >
            Photo Gallery
          </span>
          <TokenGallery
            open={galleryIsOpen}
            onClose={() => setGalleryIsOpen(false)}
            address={address}
            pictures={tokenMetaData?.Pictures}
            render={() => getTokens()}
          />
          {userAddress == address ? (
            <div
              style={{ width: "100%", position: "relative", marginTop: "30px" }}
            >
              <button
                style={{
                  backgroundColor: "lime",
                  margin: "5px",
                  float: "left",
                  borderRadius: "0.5rem",
                  border: "3px solid black",
                }}
                onClick={() => setAddPhotosIsOpen(true)}
              >
                Add Photos
              </button>

              <AddVideo address={address} render={() => getTokens()} />

              <AddPhotos
                open={addPhotosIsOpen}
                onClose={() => setAddPhotosIsOpen(false)}
                address={address}
                ProfilePic={tokenMetaData?.ProfilePic}
                render={() => getTokens()}
              />
            </div>
          ) : null}
        </Card>
      )}

      {!orders ? null : (
        <Card
          style={{
            width: "55%",
            margin: "5px",
            padding: "10px",
            float: "left",
            border: "1px solid #202020",
            borderRadius: "0.5rem",
            backgroundColor: "#202020",
            position: "relative",
          }}
        >
          <Title level={3} style={{ color: "lime", margin: "0px auto" }}>
            Active Orders
          </Title>
          <div style={{ width: "100%" }}>
            <span
              style={{
                float: "left",
                marginRight: "8.25%",
                color: "lime",
                display: "block",
              }}
            >
              Qty
            </span>
            <span
              style={{
                float: "left",
                marginRight: "8.25%",
                color: "lime",
                display: "block",
              }}
            >
              Type
            </span>
            <span
              style={{
                float: "left",
                marginRight: "8.25%",
                color: "lime",
                display: "block",
              }}
            >
              Token
            </span>
            <span
              style={{
                float: "left",
                marginRight: "8.25%",
                color: "lime",
                display: "block",
              }}
            >
              Exuection Price
            </span>
            <span
              style={{
                float: "left",
                marginRight: "8.25%",
                color: "lime",
                display: "block",
              }}
            >
              Total Cost
            </span>
          </div>
          {Object.keys(orders).map((order, index) => (
            <div>
              <Card key={index} style={{ backgroundColor: "#909090" }}>
                <span
                  style={{
                    float: "left",
                    color: "black",
                    marginRight: "8.25%",
                  }}
                >
                  {orders[order].orderAmount}
                </span>
                <span style={{ color: "black", marginRight: "8.25%" }}>
                  {orders[order].order}
                </span>
                <span style={{ color: "black", marginRight: "8.25%" }}>
                  {orders[order].tokenName}
                </span>
                <span style={{ color: "black", marginRight: "8.25%" }}>
                  {orders[order].exuectionPrice}
                </span>
                <span style={{ color: "black", marginRight: "8.25%" }}>
                  {orders[order].orderTotal}
                </span>
                <button
                  onClick={() =>
                    cancelOrder(orders[order].orderTotal).then(() =>
                      cancelUserOrder(order),
                    )
                  }
                >
                  Cancel
                </button>
              </Card>
            </div>
          ))}
        </Card>
      )}

      <Card
        style={{
          width: "55%",
          margin: "5px",
          padding: "10px",
          float: "left",
          border: "1px solid #202020",
          borderRadius: "0.5rem",
          backgroundColor: "#202020",
          position: "relative",
        }}
      >
        <Title level={3} style={{ color: "lime", margin: "0px auto" }}>
          Announcements
        </Title>
        <span>
          {userAddress == address ? (
            <button
              onClick={() => setIsOpen(true)}
              style={{
                position: "relative",
                backgroundColor: "lime",
                borderRadius: "0.5rem",
                border: "3px solid black",
              }}
            >
              Add Announcement
            </button>
          ) : null}
        </span>
        <AddAnnouncementModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          token={address}
          ProfilePic={tokenMetaData?.ProfilePic}
          render={() => getTokens()}
        ></AddAnnouncementModal>
        <Announcements
          announcements={tokenMetaData?.Announcements}
        ></Announcements>
      </Card>
    </div>
  );
}

export default Token;
