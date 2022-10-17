gridLock

gridLock is an application that is intended to be a transparent platform for crypto companies to raise capital. This application can be thought of as a next generation DEX or similar to stock exchanges around the globe. However, instead of stocks being a representation of ownership in a company operating in an economy(for example Amazon is listed on the New York Stock Exchange), instead is tokens that is ownership in a company that operates in the crypto economy. Even with the lack of government regulation around the globe, the regulation is set forth by the contract the token was built on. This sets limitations around the issuance and distribution of company tokens. Additionally, tokens can represent a specified amount of a precious metals or any other asset. Which is essentially like backing a token by gold or silver if the organization operates there token appropriately. On the NYSE today for every one ounce of gold held in reserves, there is actually 113 paper piece of gold, and the silver is a ratio of 1 oz to 406 pieces of paper. Not even the gold and silver in traditional markets have a 1 to 1 backing of certificates.

Currently, the project is under construction, and is using infura RPC Node to retrieve token data, Moralis to store additional data, and cloudinary to store pictures. Any modifications to the project will be takin in to consideration, and even rewarded with company ownership on token launch. Any current issues updates that are being worked are listed at the top of files. Ultimately, the orders will be placed as a limit or to be exuecute at a specified price. In order to complete the task may need to do a spin off of oneInches open source limit order functionality.

Cloud Functions
Moralis.Cloud.define("getTokens", async () => {

const query = new Moralis.Query("Tokens");

query.equalTo("token");

const count = await query.count(); //ADDED THIS LINE

query.limit(count); //AND ADDED THIS LINE

const results = await query.find();

let sum = [];

for (let i = 0; i < results.length; ++i) {

    await sum.push({

      "Name": results[i].get("Name"),

      "Symbol": results[i].get("Symbol"),

      "Address": results[i].get("Address"),

      "Logo": results[i].get("Logo"),

      "Type": results[i].get("Type"),

      "LastPrice": results[i].get("LastPrice"),

      "objectId": results[i].get("objectId"),

      "Chain": results[i].get("Chain"),

      "Pool": results[i].get("Pool"),

      "Description": results[i].get("Description"),

      "Website": results[i].get("Website"),

      "ProfilePic": results[i].get("ProfilePic"),

      "Pictures": results[i].get("Pictures"),

      "Video": results[i].get("Video"),

"Announcements": results[i].get("Announcements"),

      "contractABI": results[i].get("contractABI"),

      "contractAddress": results[i].get("contractAddress"),

      "orders": results[i].get("orders")

    });

}

return sum;

});

Moralis.Cloud.define("getIssues", async () => {

const query = new Moralis.Query("Admin");

query.equalTo("issue");

const count = await query.count(); //ADDED THIS LINE

query.limit(count); //AND ADDED THIS LINE

const results = await query.find();

let issues = [];

for (let i = 0; i < results.length; ++i) {

    await issues.push({

      "Email": results[i].get("Email"),

      "Reason": results[i].get("Reason"),

      "Message": results[i].get("Message"),

      "objectId": results[i].get("objectId"),

    });

}

return issues;

});

Moralis.Cloud.define("getOrders", async (objectID) => {

const query = new Moralis.Query("Orders");

query.equalTo("order");

const count = await query.count(); //ADDED THIS LINE

query.limit(count); //AND ADDED THIS LINE

const results = await query.find();

let orders = [];

for (let i = 0; i < results.length; ++i) {

    await orders.push({

      "exuecutionPrice": results[i].get("exuecutionPrice"),

      "tokenName": results[i].get("tokenName"),

      "orderAmount": results[i].get("orderAmount"),

      "transactionFee": results[i].get("transactionFee"),

      "address": results[i].get("address"),

      "orderTotal": results[i].get("orderTotal"),

      "priced": results[i].get("priced"),

      "estimatedGas": results[i].get("objectId"),

      "order": results[i].get("Email"),

      "ethCost": results[i].get("Reason"),

    });

}

return issues;

});
