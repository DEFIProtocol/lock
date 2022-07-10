import React from "react";

function LandingPage() {
  return (
    <div style={{ backgroundColor: "white" }}>
      <h1>gridLock</h1>
      <span>
        Our organization prides it self on being a transparent fungible token
        exchange. Fungible tokens are tokens that are entitlements to real world
        assets. These can range from a token backed by a treasury that holds
        silver or gold, to a crypto company bringing utilitiy to the space. Most
        crypto companies wish to make the world a better place. Even though our
        organization handselects the tokens that it offers, there may be token
        owners with ill intentions that slip through the cracks. Make sure you
        examine tokens carefully before investing.
      </span>
      <h3>Token Type Classification</h3>
      <h5>Securities</h5>
      <span>
        Security tokens can be further divided into two catergories: Equity
        tokens and asset-backed tokens. Equity tokens represent equity or stake
        in a company or organization. This typically gives the holder voting
        rights for organization decision-making and rights to dividends should
        the company decide to issue them. Asset-backed tokens are backed by
        phisical commodities. These could be a token that is pegged to the value
        of gold, silver, oil, or any other commodity used globally. These tokens
        are regulated by the details laid out in the smart contract, because
        they are bound by the details laid out in the contract.
      </span>
      <h5>Utilities</h5>
      <span>
        Utility tokens are like VIP passes to a service or product. They give
        the holder of the token special services or discounts. These products
        could be software packages or service platforms. Or even a restaurant.
      </span>
      <h5>Payment</h5>
      <span>
        Payment tokens are used for the exchange of goods and services. This is
        less of an investment and more of a use. Some companies may only accept
        these tokens for products or services, so you must make sure these
        tokens are secure. You could think of them as chips at a casino. When
        you play a game, you give them cash in exchange for chips which have a
        specified value. There is really no regulation on these instruments so
        be weary of purchasing them unless you plan on using their service.
      </span>
      <h5>Stablecoins</h5>
      <span>
        Stablecoins are stable in value typically to a fiat currency. This value
        can be set algorithmacily, backing it with reserves, or backed by a
        commodity. For example, Tether(USDT) holds a USD in a bank account for
        every token in circulation.
      </span>
    </div>
  );
}

export default LandingPage;
