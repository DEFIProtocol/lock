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
  const { Moralis, isAuthenticated, isInitialized } = useMoralis();
  var toToken = {
    symbol: `${symbol}`,
    name: `${name}`,
    address: `${address}`,
    decimals: 18,
    logoURI: `${logo}`,
  };
  var sellToken = {
    symbol: `${symbol}`,
    name: `${name}`,
    address: `${address}`,
    decimals: 18,
    logoURI: `${logo}`,
  };
  const { getQuote } = useInchDex();
  const [orderPrice, setOrderPrice] = useState("");
  const [orderAmount, setOrderAmount] = useState();
  const [quote, setQuote] = useState();
  const [priced, setPriced] = useState("usd");
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

  const estimatedGas = async () => {
    if (!isInitialized) return null;
    try {
      const fromToken = {
        symbol: "WETH",
        name: "Wrapped Ether",
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        decimals: 18,
        logoURI:
          "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
      };
      const currentTrade = {
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: orderAmount,
        chain: chain,
      };
      var gas = await getQuote(currentTrade);
      var ethGas = `${gas?.estimatedGas} WEI`;
      setQuote(ethGas);
    } catch (error) {
      console.log(error);
    }
  };

  const submitOrder = async () => {
    if (!quote) return null;
    if (priced == "usd") {
      var orderValue = orderPrice * orderAmount;
      var ethCost = ethValue * orderAmount * 1.005;
      var orderTotal = (orderValue * 1.005).toLocaleString();
      var fee = (orderTotal - orderValue).toLocaleString();
      var orderDetails = {
        priced: priced,
        order: "Buy",
        tokenName: name,
        address: address,
        orderTotal: orderTotal,
        ethTotal: ethCost,
        exuectionPrice: orderPrice,
        orderAmount: orderAmount,
        estimatedGas: quote,
        transactionFee: fee,
      };
      let approve = confirm(`
                Purchase of ${name}:
                    USD/${name}
                    Token Amount:  ${orderAmount}
                    Order Price:  $${orderPrice} 
                    Estimated Gas:  ${quote}
                    Transaction Fee:  $${fee}
                    Order Total in USD:  $${orderTotal}
                    Order Total in ETH:  ${ethCost}
                **Due to exchange rates we hold additional Ethereum to complete your order**
                **Additional ethereum will be returned to you**
                **Please confirm your order.**
                `);
      if (approve == true) {
        try {
          const user = await Moralis.User.current();
          await user.addUnique("Orders", orderDetails);
          await user.save();
          const orders = Moralis.Object.extend("Orders");
          const order = new orders();
          order.set("orderAmount", orderAmount);
          order.set("priced", priced);
          order.set("tokenName", name);
          order.set("address", address);
          order.set("orderTotal", orderTotal);
          order.set("exuecutionPrice", orderPrice);
          order.set("orderAmount", orderAmount);
          order.set("transactionFee", fee);
          order.set("estimatedGas", quote);
          order.set("order", "Buy");
          await order.save();
        } catch (error) {
          alert("error" + error.code + error.message);
        }
      }
      renderOrder();
    } else {
      var orderValue = orderPrice * orderAmount;
      var ethCost = orderValue * 1.005;
      var fee = ethCost - orderValue;
      var orderTotal = ethCost * (price / ethValue);
      var orderDetails = {
        priced: priced,
        order: "Buy",
        tokenName: name,
        address: address,
        orderTotal: orderTotal,
        exuectionPrice: orderPrice,
        orderAmount: orderAmount,
        estimatedGas: quote,
        transactionFee: fee,
      };
      let approve = confirm(`
                Purchase of ${name}:
                    ETH/${name}
                    Token Amount:  ${orderAmount}
                    Order Price:  ${orderPrice} 
                    Estimated Gas:  ${quote}
                    Transaction Fee:  ${fee} ETH
                    Order Total in USD:  $${orderTotal}
                    Order Total in ETH:  ${ethCost}
                **Due to exchange rates we hold additional Ethereum to complete your order**
                **Additional ethereum will be returned to you**
                **Please confirm your order.**
                `);
      if (approve == true) {
        try {
          const user = await Moralis.User.current();
          await user.addUnique("Orders", orderDetails);
          await user.save();
          const orders = Moralis.Object.extend("Orders");
          const order = new orders();
          order.set("orderAmount", orderAmount);
          order.set("priced", priced);
          order.set("tokenName", name);
          order.set("address", address);
          order.set("orderTotal", orderTotal);
          order.set("exuecutionPrice", orderPrice);
          order.set("orderAmount", orderAmount);
          order.set("transactionFee", fee);
          order.set("estimatedGas", quote);
          order.set("order", "Buy");
          await issue.save();
        } catch (error) {
          alert("error" + error.code + error.message);
        }
        renderOrder();
      }
    }
  };

  const estimatedGasSell = async () => {
    if (!isInitialized) return null;
    try {
      const toToken = {
        symbol: "WETH",
        name: "Wrapped Ether",
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        decimals: 18,
        logoURI:
          "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
      };
      const currentTrade = {
        fromToken: sellToken,
        toToken: toToken,
        fromAmount: orderAmount,
        chain: chain,
      };
      var gas = await getQuote(currentTrade);
      var ethGas = `${gas?.estimatedGas} WEI`;
      setQuote(ethGas);
    } catch (error) {
      console.log(error);
    }
  };

  const submitSellOrder = async () => {
    if (!quote) return null;
    if (priced == "usd") {
      var orderValue = orderPrice * orderAmount;
      var ethCost = ethValue * orderAmount * 1.005;
      var orderTotal = (orderValue * 1.005).toLocaleString();
      var fee = (orderTotal - orderValue).toLocaleString();
      var orderDetails = {
        priced: priced,
        order: "Sell",
        tokenName: name,
        address: address,
        orderTotal: orderTotal,
        ethTotal: ethCost,
        exuectionPrice: orderPrice,
        orderAmount: orderAmount,
        estimatedGas: quote,
        transactionFee: fee,
      };
      let approve = confirm(`
                Purchase of ${name}:
                    USD/${name}
                    Token Amount:  ${orderAmount}
                    Order Price:  $${orderPrice} 
                    Estimated Gas:  ${quote}
                    Transaction Fee:  $${fee}
                    Order Total in USD:  $${orderTotal}
                    Order Total in ETH:  ${ethCost}
                **Due to exchange rates we hold additional Ethereum to complete your order**
                **Additional ethereum will be returned to you**
                **Please confirm your order.**
                `);
      if (approve == true) {
        try {
          const user = await Moralis.User.current();
          await user.addUnique("Orders", orderDetails);
          await user.save();
          const orders = Moralis.Object.extend("Orders");
          const order = new orders();
          order.set("orderAmount", orderAmount);
          order.set("priced", priced);
          order.set("tokenName", name);
          order.set("address", address);
          order.set("orderTotal", orderTotal);
          order.set("exuecutionPrice", orderPrice);
          order.set("orderAmount", orderAmount);
          order.set("transactionFee", fee);
          order.set("estimatedGas", quote);
          order.set("order", "Sell");
          await order.save();
        } catch (error) {
          alert("error" + error.code + error.message);
        }
      }
      renderOrder();
    } else {
      var orderValue = orderPrice * orderAmount;
      var ethCost = orderValue * 1.005;
      var fee = ethCost - orderValue;
      var orderTotal = ethCost * (price / ethValue);
      var orderDetails = {
        priced: priced,
        order: "Sell",
        tokenName: name,
        address: address,
        orderTotal: orderTotal,
        exuectionPrice: orderPrice,
        orderAmount: orderAmount,
        estimatedGas: quote,
        transactionFee: fee,
      };
      let approve = confirm(`
                Purchase of ${name}:
                    ETH/${name}
                    Token Amount:  ${orderAmount}
                    Order Price:  ${orderPrice} 
                    Estimated Gas:  ${quote}
                    Transaction Fee:  ${fee} ETH
                    Order Total in USD:  $${orderTotal}
                    Order Total in ETH:  ${ethCost}
                **Due to exchange rates we hold additional Ethereum to complete your order**
                **Additional ethereum will be returned to you**
                **Please confirm your order.**
                `);
      if (approve == true) {
        try {
          const user = await Moralis.User.current();
          await user.addUnique("Orders", orderDetails);
          await user.save();
          const issues = Moralis.Object.extend("Admin");
          const issue = new issues();
          const orders = Moralis.Object.extend("Orders");
          const order = new orders();
          order.set("orderAmount", orderAmount);
          order.set("priced", priced);
          order.set("tokenName", name);
          order.set("address", address);
          order.set("orderTotal", orderTotal);
          order.set("exuecutionPrice", orderPrice);
          order.set("orderAmount", orderAmount);
          order.set("transactionFee", fee);
          order.set("estimatedGas", quote);
          order.set("order", "Sell");
          await order.save();
        } catch (error) {
          alert("error" + error.code + error.message);
        }
        renderOrder();
      }
    }
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
        onClick={() => estimatedGas().then(submitOrder())}
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
        onClick={() => estimatedGasSell().then(submitSellOrder())}
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
    </form>
  );
}

export default Order;
