import React, { useEffect, useState, useCallback } from "react";
import "./tokenIndex.css";
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
  ActiveOrder,
  AddAnnouncementModal,
  TokenGallery,
  AddPhotos,
  Announcements,
  Order,
  AddVideo,
  UpdateType,
  UpdateDescription,
  UpdateWebsite,
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

  const getTokens = useCallback(async () => {
    fetch({
      onSuccess: (sum) =>
        setTokenMetaData(sum.filter((token) => token.Address == address).pop()),
      onError: (error) => console.log(error),
    });
  }, [address, fetch]);

  useEffect(() => {
    getTokens();
  }, [getTokens]);

  const getFavorites = useCallback(async () => {
    if (!isAuthenticated) return null;
    const user = await Moralis.User.current();
    let favorite = user.get("Favorites");
    setWatchlist(favorite);
  }, [isAuthenticated, Moralis]);

  useEffect(() => {
    getFavorites();
  }, [getFavorites]);

  const getOrders = useCallback(async () => {
    if (!isAuthenticated) return null;
    const user = await Moralis.User.current();
    let orders = user.get("orders");
    setOrders(orders);
  }, [Moralis, isAuthenticated]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

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

  const updatePrice = useCallback(async () => {
    const tokens = Moralis.Object.extend("Tokens");
    const query = new Moralis.Query(tokens);
    query.equalTo("Address", `${address}`);
    const updateToken = await query.first();
    updateToken.set("LastPrice", tokenPrice);
    updateToken.save();
    return updateToken;
  }, [Moralis, address, tokenPrice]);

  const fetchTokenPrice = useCallback(async () => {
    const options = await {
      address: address,
      chain: tokenMetaData?.Chain,
    };
    const price = await Web3Api.token.getTokenPrice(options);
    const ethPrice = price.nativePrice.value / 1000000000000000000;
    setEthValue(`${ethPrice}`);
    setTokenPrice(`${price.usdPrice.toLocaleString()}`).then(updatePrice());
  }, [Web3Api, address, tokenMetaData, updatePrice]);

  useEffect(() => {
    fetchTokenPrice();
  }, [fetchTokenPrice]);

  useEffect(() => {
    if (isAuthenticated) {
      setUserAddress(user.attributes.ethAddress);
    }
  }, [isAuthenticated, user]);

  // AAVE address 0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae
  console.log(orders);
  return (
    <div className="tokenPage">
      <Card className="tokenDataCard">
        <TokenData
          price={tokenPrice}
          contractAddress={tokenMetaData?.contractAddress}
          ethValue={ethValue}
          logo={tokenMetaData?.Logo}
        />
      </Card>

      <Card className="leftCard">
        {watchlist.includes(address) ? (
          <StarFilled
            className="favorited"
            onClick={() => removeWatchlist(address)}
          />
        ) : (
          <StarOutlined
            className="favorited"
            onClick={() => addWatchlist(address)}
          />
        )}
        <LineChart address={address} chain={tokenMetaData?.Chain} />
      </Card>

      <Card className="rightCard">
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

      <Card className="rightCard">
        <Title level={3} style={{ color: "lime" }}>
          Description
        </Title>
        <span className="text">Token Type: {tokenMetaData?.Type}</span>
        {userAddress == address ? (
          <UpdateType address={address} render={() => getTokens()} />
        ) : null}
        <span className="description">{tokenMetaData?.Description}</span>
        <span>
          {userAddress == address ? (
            <UpdateDescription address={address} render={() => getTokens()} />
          ) : null}
        </span>
      </Card>

      <Card className="rightCard">
        <Title level={3} style={{ color: "lime" }}>
          Website
        </Title>
        <a className="text" href={tokenMetaData?.Website}>
          {tokenMetaData?.Website}
        </a>
        <span>
          {userAddress == address ? (
            <UpdateWebsite address={address} render={() => getTokens()} />
          ) : null}
        </span>
      </Card>

      <Card className="leftCard">
        <ActiveOrder objectID={orders} />
      </Card>

      {!tokenMetaData?.ProfilePic &&
      !tokenMetaData?.Video &&
      !tokenMetaData?.Pictures ? null : (
        <Card className="rightCard">
          <div>
            {!tokenMetaData?.Video ? (
              <Image
                publicId={tokenMetaData?.ProfilePic}
                cloudName="gridlock"
                className="image"
              />
            ) : (
              <div className="video">
                <ReactPlayer
                  controls
                  url={tokenMetaData?.Video}
                  width="34.2vw"
                  height="20.5vw"
                />
              </div>
            )}
          </div>
          <span className="photoGallery" onClick={() => setGalleryIsOpen(true)}>
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
            <div className="galleryContainer">
              <button
                className="galleryButton"
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

      <Card className="leftCard">
        <Title level={3} style={{ color: "lime" }}>
          Announcements
        </Title>
        <span>
          {userAddress == address ? (
            <button onClick={() => setIsOpen(true)} className="galleryButton">
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
