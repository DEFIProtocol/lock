import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import useInchDex from "hooks/useInchDex";

function Order({
  symbol,
  name,
  logo,
  address,
  chain,
  price,
  ethValue,
  renderOrder,
}) {
  const { Moralis, isInitialized, isAuthenticated } = useMoralis();
  const { getQuote } = useInchDex();
  const [orderPrice, setOrderPrice] = useState("");
  const [orderAmount, setOrderAmount] = useState();
  const [orderCost, setOrderCost] = useState();
  const [quote, setQuote] = useState();
  const [priced, setPriced] = useState("usd");

  const [BuyOrSell, setbuyOrSell] = useState();
  const [isOpen, setIsOpen] = useState(false);
  // var ethMultiplier = 1 / ethValue;
  const [checked, setChecked] = useState({
    ethEx: false,
    usdEx: true,
  });

  const handleCheck = (e) => {
    if (e == "ethEx") {
      setChecked({
        ethEx: true,
        usdEx: false,
      });
      setPriced("eth");
    } else {
      setChecked({
        ethEx: false,
        usdEx: true,
      });
      setPriced("usd");
    }
  };

  const estimatedGas = async (buyOrSell) => {
    handleOrder(buyOrSell);
    if (!isInitialized) return null;
    const WETH = {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      decimals: 18,
      logoURI:
        "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
    };
    var token = {
      symbol: `${symbol}`,
      name: `${name}`,
      address: `${address}`,
      decimals: 18,
      logoURI: `${logo}`,
    };
    var fromToken = buyOrSell == "buy" ? WETH : token;
    var toToken = buyOrSell == "buy" ? token : WETH;
    var currentTrade =
      buyOrSell == "buy"
        ? {
          fromToken: fromToken,
          toToken: toToken,
          fromAmount: orderAmount,
          chain: chain,
        }
        : {
          fromToken: fromToken,
          toToken: toToken,
          fromAmount: orderAmount,
          chain: chain,
        };
    try {
      var gas = await getQuote(currentTrade);
      var ethGas = `${gas?.estimatedGas} WEI`;
      setQuote(ethGas);
      setbuyOrSell(buyOrSell);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOrder = () => {
    //console.log(quote)
    //console.log(decQuote)
    var orderValue = orderPrice * orderAmount;
    var ethCost =
      priced == "usd"
        ? (ethValue * orderAmount * 1.01) /*+ decQuote*/
          .toLocaleString() // buy or sell token in usd
        : orderValue * 1.01; /*+ decQuote*/ // buy or sell token in eth
    var orderTotal =
      priced == "usd"
        ? (orderValue * 1.01) /* (decQuote * (ethValue / price))*/
          .toLocaleString() // buy or sell token in usd
        : ethCost * (price / ethValue); /* (decQuote * (ethValue / price))*/ // buy or sell token in eth
    var fee =
      priced == "usd"
        ? (orderTotal - orderValue).toLocaleString() // buy or sell token in usd
        : (ethCost - orderValue).toLocaleString(); // buy or sell token in eth
    var orderDetails = {
      ethCost: ethCost,
      orderTotal: orderTotal,
      fee: fee,
    };
    setOrderCost(orderDetails);
  };

  const userRelation = async () => {
    if (!isAuthenticated) return null; // add redirect or error with error saying need to authenticate
    var order = await postOrder(
      orderAmount,
      priced,
      name,
      address,
      orderCost.orderTotal,
      orderPrice,
      orderCost.fee,
      quote,
      BuyOrSell,
      orderCost.ethCost)
    console.log(order);
    try {
      const orders = Moralis.Object.extend('Orders')
      const user = Moralis.User.current();
      const relation = user.relation(orders);
      console.log(relation);
      console.log(user)
      console.log(order)
      user.set("orders", order);
      user.save();
      () => setIsOpen(false);
    } catch (error) {
      alert(error)
    }
  }

  const postOrder = async (amount, denominated, Name, add, total, exuecution, fee, gas, orderType, ethTotal) => {
    try {
      const orders = Moralis.Object.extend("Orders");
      const order = new orders();
      order.set("orderAmount", amount);
      order.set("priced", denominated);
      order.set("tokenName", Name);
      order.set("address", add);
      order.set("orderTotal", total);
      order.set("exuecutionPrice", exuecution);
      order.set("transactionFee", fee);
      order.set("estimatedGas", gas);
      order.set("order", orderType);
      order.set("ethCost", ethTotal);
      await order.save();
      return order;
    } catch (error) {
      console.log(error);
    }
    renderOrder();
  };

  return (
    <form>
      <div>
        <input
          type="checkbox"
          value="usdEx"
          checked={checked.usdEx}
          onChange={(e) => handleCheck(e.target.value)}
        />
        <label for="usdEx" style={{ color: "DarkGray" }}>
          {" "}
          Order Priced in USD
        </label>
      </div>
      <div>
        <input
          type="checkbox"
          value="ethEx"
          checked={checked.ethEx}
          onChange={(e) => handleCheck(e.target.value)}
        />
        <label for="ethEx" style={{ color: "DarkGray" }}>
          {" "}
          Order Priced in ETH
        </label>
      </div>
      <input
        onChange={(e) => setOrderPrice(e.target.value)}
        type="number"
        placeholder="Order Price"
        style={{
          width: "95%",
          margin: "15px auto",
          backgroundColor: "black",
          color: "lightGray",
        }}
      />
      <input
        onChange={(e) => setOrderAmount(parseFloat(e.target.value))}
        type="number"
        placeholder="Quantity"
        style={{
          width: "95%",
          margin: "15px auto",
          backgroundColor: "black",
          color: "lightGray",
        }}
      />
      <button
        type="button"
        value="buy"
        onClick={(e) => estimatedGas(e.target.value).then(setIsOpen(true))}
        style={{
          backgroundColor: "green",
          margin: "10px",
          height: "40px",
          width: "80px",
          borderRadius: "0.5rem",
        }}
      >
        Buy
      </button>
      <button
        type="button"
        value="sell"
        onClick={(e) => estimatedGas(e.target.value).then(setIsOpen(true))}
        style={{
          backgroundColor: "red",
          margin: "10px",
          height: "40px",
          width: "80px",
          borderRadius: "0.5rem",
        }}
      >
        Sell
      </button>
      {!isOpen ? null : (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#202020",
            padding: "50px",
            zIndex: 1000,
            borderRadius: ".5rem",
            border: "2px black solid",
          }}
        >
          <p style={{ color: "#909090" }}>
            Purchase of {name}:<br />
            {priced == "usd" ? <span>USD</span> : <span>ETH</span>}/${name}
            <br />
            Token Amount: ${orderAmount}
            <br />
            Order Price: ${orderPrice}
            <br />
            Estimated Gas: {quote}
            <br />
            Transaction Fee: ${orderCost?.fee}
            <br />
            Order Total in USD: ${orderCost?.orderTotal}
            <br />
            Order Total in ETH: {orderCost?.ethCost}
            <br />
            **Due to exchange rates we hold additional Ethereum to complete your
            order**
            <br />
            **Additional ethereum will be returned to you**
            <br />
            **Please confirm your order.**
          </p>
          <button type="button" onClick={() => userRelation()}>
            Confirm
          </button>
          <button type="button" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
        </div>
      )}
    </form>
  );
}

export default Order;
