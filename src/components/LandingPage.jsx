import React from "react";
import { Card } from "antd";

function LandingPage() {
  return (
    <div style={{ backgroundColor: "black" }}>
      <div style={{ textAlign: "center", padding: "30px" }}>
        <h1
          style={{ color: "lime", display: "inline-block", fontSize: "2.5em" }}
        >
          grid
        </h1>
        <h1
          style={{ color: "white", display: "inline-block", fontSize: "2.5em" }}
        >
          Lock
        </h1>
      </div>
      <Card
        style={{
          backgroundColor: "#202020",
          width: "100%",
          border: "1px solid black",
          borderRadius: ".5em",
          padding: "10px",
        }}
      >
        <span style={{ color: "#909090", padding: "10px" }}>
          Our organization prides it self on being a transparent fungible token
          exchange. Fungible tokens are tokens that are entitlements to real
          world assets. These can range from a token backed by a treasury that
          holds silver or gold, to a crypto company bringing utilitiy to the
          space. Most crypto companies wish to make the world a better place.
          Even though our organization handselects the tokens that it offers,
          there may be token owners with ill intentions that slip through the
          cracks. Make sure you examine tokens carefully before investing.
        </span>
      </Card>
      <h3
        style={{
          color: "#909090",
          textAlign: "center",
          paddingTop: "30px",
          fontSize: "1.5em",
        }}
      >
        Token Type Classification
      </h3>
      <Card
        style={{
          backgroundColor: "#202020",
          width: "100%",
          border: "1px solid black",
          borderRadius: ".5em",
          margin: "10px",
        }}
      >
        <h5 style={{ color: "#909090", fontSize: "1.25em" }}>Securities</h5>
        <span style={{ color: "#909090" }}>
          Security tokens can be further divided into two catergories: Equity
          tokens and asset-backed tokens. Equity tokens represent equity or
          stake in a company or organization. This typically gives the holder
          voting rights for organization decision-making and rights to dividends
          should the company decide to issue them. Asset-backed tokens are
          backed by phisical commodities. These could be a token that is pegged
          to the value of gold, silver, oil, or any other commodity used
          globally. These tokens are regulated by the details laid out in the
          smart contract, because they are bound by the details laid out in the
          contract.
        </span>
      </Card>
      <Card
        style={{
          backgroundColor: "#202020",
          width: "100%",
          border: "1px solid black",
          borderRadius: ".5em",
          margin: "10px",
        }}
      >
        <h5 style={{ color: "#909090", fontSize: "1.25em" }}>Utilities</h5>
        <span style={{ color: "#909090" }}>
          Utility tokens are like VIP passes to a service or product. They give
          the holder of the token special services or discounts. These products
          could be software packages or service platforms. Or even a restaurant.
        </span>
      </Card>
      <Card
        style={{
          backgroundColor: "#202020",
          width: "100%",
          border: "1px solid black",
          borderRadius: ".5em",
          margin: "10px",
        }}
      >
        <h5 style={{ color: "#909090", fontSize: "1.25em" }}>Payment</h5>
        <span style={{ color: "#909090" }}>
          Payment tokens are used for the exchange of goods and services. This
          is less of an investment and more of a use. Some companies may only
          accept these tokens for products or services, so you must make sure
          these tokens are secure. You could think of them as chips at a casino.
          When you play a game, you give them cash in exchange for chips which
          have a specified value. There is really no regulation on these
          instruments so be weary of purchasing them unless you plan on using
          their service.
        </span>
      </Card>
      <Card
        style={{
          backgroundColor: "#202020",
          width: "100%",
          border: "1px solid black",
          borderRadius: ".5em",
          margin: "10px",
        }}
      >
        <h5 style={{ color: "#909090", fontSize: "1.25em" }}>Stablecoins</h5>
        <span style={{ color: "#909090" }}>
          Stablecoins are stable in value typically to a fiat currency. This
          value can be set algorithmacily, backing it with reserves, or backed
          by a commodity. For example, Tether(USDT) holds a USD in a bank
          account for every token in circulation.
        </span>
      </Card>
    </div>
  );
}

export default LandingPage;
