import React, { useEffect, useState, useCallback } from "react";
import { useMoralisCloudFunction, useMoralis } from "react-moralis";
import { Skeleton, Card, Typography } from "antd";

function ActiveOrder(objectId) {
  const { isAuthenticated, Moralis } = useMoralis();
  const [userOrder, setUserOrder] = useState({});
  const [ord, setOrd] = useState();
  const { fetch } = useMoralisCloudFunction(
    "getOrders",
    { order: "orders" },
    { autoFetch: false },
  );

  const getOrders = useCallback(async () => {
    if (!isAuthenticated) return null;
    const user = await Moralis.User.current();
    let orderIDs = user.get("Orders");
    orderIDs = orderIDs.map((e) => e.id);
    setOrd(orderIDs);
  }, [isAuthenticated, Moralis]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    fetch({
      onSuccess: (orders) =>
        setUserOrder(orders.filter((order) => order == ord)),
      onError: (error) => console.log(error),
    });
  }, [fetch]);

  console.log(userOrder);

  return (
    <>
      <Skeleton loading={!userOrder} active>
        <Typography.Title
          level={3}
          style={{ color: "lime", margin: "0px auto" }}
        >
          Active Orders
        </Typography.Title>
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
        {Object.keys(userOrder).map((order, index) => (
          <div>
            <Card
              key={index}
              style={{
                backgroundColor: "black",
                borderRadius: ".5em",
                border: "1px black solid",
              }}
            >
              <span
                style={{
                  float: "left",
                  color: "black",
                  marginRight: "8.25%",
                }}
              >
                {userOrder[order].orderAmount}
              </span>
              <span style={{ color: "black", marginRight: "8.25%" }}>
                {userOrder[order].order}
              </span>
              <span style={{ color: "black", marginRight: "8.25%" }}>
                {userOrder[order].tokenName}
              </span>
              <span style={{ color: "black", marginRight: "8.25%" }}>
                {userOrder[order].exuectionPrice}
              </span>
              <span style={{ color: "black", marginRight: "8.25%" }}>
                {userOrder[order].orderTotal}
              </span>
              <button onClick={() => cancelOrder(objectID?.objectID?.id)}>
                Cancel
              </button>
            </Card>
          </div>
        ))}
      </Skeleton>
    </>
  );
}
export default ActiveOrder;
