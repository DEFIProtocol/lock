import React, { useEffect, useState } from "react";
import { useMoralisCloudFunction, useMoralis } from "react-moralis";
import { Skeleton, Card, Typography } from "antd";

function ActiveOrder() {
  const { isAuthenticated } = useMoralis();
  const [userOrder, setUserOrder] = useState({});
  const { fetch } = useMoralisCloudFunction(
    "getOrders",
    { order: "orders" },
    { autoFetch: false },
  );

  useEffect(() => {
    if (!isAuthenticated) return null;
    fetch({
      onSuccess: (orders) => setUserOrder(orders),
      onError: (error) => console.log(error),
    });
  }, [fetch, isAuthenticated]);

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
