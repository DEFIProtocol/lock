// fix price calls
// make sure pricing is accurate
// fix timeperiod change

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
import { useMoralis } from "react-moralis";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const LineChart = ({ address, chain }) => {
  const { Moralis } = useMoralis();
  const [price, setPrice] = useState();
  const [timeperiod, setTimeperiod] = useState("7");

  const tokenTimestamp = Array(Number(timeperiod))
    .fill()
    .map((e, i) => moment().subtract(i, "d").format("YYYY-MM-DD"))
    .reverse();

  const priceHistory = async () => {
    if (!Moralis) return null;
    let blocks = await Promise.all(
      tokenTimestamp.map(
        async (e) =>
          await Moralis.Web3API.native.getDateToBlock({
            date: e,
            chain: chain,
          }),
      ),
    );
    let tokenPrice = await Promise.all(
      blocks.map(
        async (e) =>
          await Moralis.Web3API.token.getTokenPrice({
            address: address,
            to_block: e.block,
            chain: chain,
          }),
      ),
    );
    tokenPrice = tokenPrice.map((e) => e.usdPrice);
    setPrice(tokenPrice);
    console.log(tokenPrice);
  };

  useEffect(() => {
    priceHistory();
  }, [timeperiod]);

  const data = {
    labels: tokenTimestamp,
    datasets: [
      {
        label: "Price in USD",
        data: price,
        fill: false,
        backgroundColor: "black",
        borderColor: "lime",
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  const handleTimeFrame = (value) => {
    setTimeperiod(value);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          justifyContent: "center",
          display: "flex",
          margin: "0px auto",
          marginBottom: "0px",
        }}
      >
        <span
          style={{
            color: "lime",
            width: "16%",
            height: "100%",
            fontSize: "1.25em",
            marginTop: "5%",
            margin: "2px",
            border: `3px solid ${timeperiod == "7" ? "lime" : "#606060"}`,
            textAlign: "center",
            padding: "2.5%",
            borderRadius: ".5em",
            borderTop: "0px",
          }}
          onClick={() => handleTimeFrame("7")}
        >
          7d
        </span>
        <span
          style={{
            color: "lime",
            width: "16%",
            height: "100%",
            fontSize: "1.25em",
            marginTop: "5%",
            margin: "2px",
            border: `3px solid ${timeperiod == "30" ? "lime" : "#606060"}`,
            textAlign: "center",
            padding: "2.5%",
            borderRadius: ".5em",
            borderTop: "0px",
          }}
          onClick={() => handleTimeFrame("30")}
        >
          1m
        </span>
        <span
          style={{
            color: "lime",
            width: "16%",
            height: "100%",
            fontSize: "1.25em",
            marginTop: "5%",
            margin: "2px",
            border: `3px solid ${timeperiod == "60" ? "lime" : "#606060"}`,
            textAlign: "center",
            padding: "2.5%",
            borderRadius: ".5em",
            borderTop: "0px",
          }}
          onClick={() => handleTimeFrame("60")}
        >
          2m
        </span>
        <span
          style={{
            color: "lime",
            width: "16%",
            height: "100%",
            fontSize: "1.25em",
            marginTop: "5%",
            margin: "2px",
            border: `3px solid ${timeperiod == "90" ? "lime" : "#606060"}`,
            textAlign: "center",
            padding: "2.5%",
            borderRadius: ".5em",
            borderTop: "0px",
          }}
          onClick={() => handleTimeFrame("90")}
        >
          3m
        </span>
        <span
          style={{
            color: "lime",
            width: "16%",
            height: "100%",
            fontSize: "1.25em",
            marginTop: "5%",
            margin: "2px",
            border: `3px solid  ${timeperiod == "180" ? "lime" : "#606060"}`,
            textAlign: "center",
            padding: "2.5%",
            borderRadius: ".5em",
            borderTop: "0px",
          }}
          onClick={() => handleTimeFrame("180")}
        >
          6m
        </span>
        <span
          style={{
            color: "lime",
            width: "16%",
            height: "100%",
            fontSize: "1.25em",
            marginTop: "5%",
            margin: "2px",
            border: `3px solid  ${timeperiod == "365" ? "lime" : "#606060"}`,
            textAlign: "center",
            padding: "2.5%",
            borderRadius: ".5em",
            borderTop: "0px",
          }}
          onClick={() => handleTimeFrame("365")}
        >
          1y
        </span>
      </div>
      <Line data={data} options={options} style={{ width: "100%" }} />
    </>
  );
};
export default LineChart;
