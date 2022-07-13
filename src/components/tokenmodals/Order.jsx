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
  const { Moralis, isInitialized } = useMoralis();
  const { getQuote } = useInchDex();
  const [orderPrice, setOrderPrice] = useState("");
  const [orderAmount, setOrderAmount] = useState();
  const [quote, setQuote] = useState();
  const [priced, setPriced] = useState("usd");
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
    if (!isInitialized) return null;
    const WETH = {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      decimals: 18,
      logoURI:
        "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
    };
    var token =
    {
      symbol: `${symbol}`,
      name: `${name}`,
      address: `${address}`,
      decimals: 18,
      logoURI: `${logo}`,
    };
    console.log(token, WETH)
    var fromToken = buyOrSell == "buy" ? WETH : token;
    var toToken = buyOrSell == "buy" ? token : WETH;
    var currentTrade = buyOrSell == "buy" ?
      {
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: orderAmount,
        chain: chain,
      } :
      {
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: orderAmount,
        chain: chain,
      };
    console.log(currentTrade);
    console.log(toToken);
    console.log(fromToken);
    try {
      var gas = await getQuote(currentTrade);
      var ethGas = `${gas?.estimatedGas} WEI`;
      setQuote(ethGas);
    } catch (error) {
      console.log(error);
    }
    handleOrder();
  };

  const handleOrder = () => {
    var orderValue = orderPrice * orderAmount;
    var ethCost = priced == "usd" ?
      (ethValue * orderAmount * 1.01).toLocaleString() : // buy or sell token in usd
      orderValue * 1.01; // buy or sell token in eth
    var orderTotal = priced == "usd" ?
      (orderValue * 1.01).toLocaleString() : // buy or sell token in usd
      ethCost * (price / ethValue); // buy or sell token in eth
    var fee = priced == "usd" ?
      (orderTotal - orderValue).toLocaleString() : // buy or sell token in usd
      (ethCost - orderValue).toLocaleString(); // buy or sell token in eth
    return orderValue, orderTotal, ethCost, fee;
  }

  const postOrder = async (buyOrSell, fee, orderTotal, ethCost) => {
    try {
      const orders = Moralis.Object.extend("Orders");
      const order = new orders();
      order.set("orderAmount", orderAmount);
      order.set("priced", priced);
      order.set("tokenName", name);
      order.set("address", address);
      order.set("orderTotal", orderTotal);
      order.set("exuecutionPrice", orderPrice);
      order.set("transactionFee", fee);
      order.set("estimatedGas", quote);
      order.set("order", buyOrSell);
      order.set("ethCost", ethCost);
      await order.save();
    } catch (error) {
      alert("error" + error.code + error.message);
    }
    renderOrder();
  }

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
        onClick={(e) => estimatedGas(e.target.value).then(() => setIsOpen(true))}
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
        onClick={(e) => estimatedGas(e.target.value).then(() => setIsOpen(true))}
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
      {!isOpen ? null :
        <div>
          <span>Purchase of ${name}:
            {priced == "usd" ? <span>USD</span> : <span>ETH</span>}/${name}
            Token Amount:  ${orderAmount}
            Order Price:  $${orderPrice}
            Estimated Gas:  ${quote}
            Transaction Fee:  $${fee}
            Order Total in USD:  $${orderTotal}
            Order Total in ETH:  ${ethCost}
            **Due to exchange rates we hold additional Ethereum to complete your order**
            **Additional ethereum will be returned to you**
            **Please confirm your order.**</span>
          <button type="button" onClick={postOrder}>Confirm</button>
          <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
        </div>}
    </form>
  );
}

export default Order;
