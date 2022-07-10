import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Row, Typography, Select } from "antd";
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

const styles = {
  chartheader: {
    display: "flex",
    justifyContent: "space-between",
    color: "lime",
    height: "100%",
  },
  charttitle: {
    color: "lime",
  },
};

export const LineChart = ({
  logo,
  address,
  chain,
  tokenName,
  currentPrice,
  ethValue,
}) => {
  const { Moralis } = useMoralis();
  const [price, setPrice] = useState();
  const [timeperiod, setTimeperiod] = useState("7");

  const time = ["7", "30", "90", "365"];

  const tokenTimestamp = Array(Number(timeperiod))
    .fill()
    .map((e, i) => moment().subtract(i, "d").format("YYYY-MM-DD"))
    .reverse();

  const priceHistory = async () => {
    if (!Moralis) return null;
    let blocks = await Promise.all(
      tokenTimestamp.map(
        async (e, i) =>
          await Moralis.Web3API.native.getDateToBlock({
            date: e,
            chain: chain,
          }),
      ),
    );
    let tokenPrice = await Promise.all(
      blocks.map(
        async (e, i) =>
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
  }, []);

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

  const handleChange = (value) => {
    setTimeperiod(value);
  };

  return (
    <>
      <Row style={styles.chartheader}>
        <div style={{ display: "inline-block", width: "100%" }}>
          <img
            src={logo}
            style={{
              height: "50px",
              width: "50px",
              marginRight: "20px",
              float: "left",
            }}
            alt="No Logo"
          />
          <Typography.Title level={4} style={styles.charttitle}>
            {tokenName}
          </Typography.Title>
          <Typography.Title level={5} style={styles.charttitle}>
            Current Price: ${currentPrice}
          </Typography.Title>
          <Typography.Title
            level={5}
            style={{ marginLeft: "30%", color: "lime" }}
          >
            ETH/{tokenName} : {ethValue}
          </Typography.Title>
          <Select
            style={{ marginLeft: "70%" }}
            defaultValue="7"
            placeholder="Select Timeperiod"
            onChange={handleChange}
          >
            {time.map((date) => (
              <Option key={date}>{date}</Option>
            ))}
          </Select>
        </div>
      </Row>
      <Line data={data} options={options} style={{ height: "100%" }} />
    </>
  );
};
export default LineChart;
