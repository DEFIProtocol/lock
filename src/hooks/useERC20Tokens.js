import { useMemo, useState } from "react";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";

const useERC20Tokens = () => {
  const { Moralis } = useMoralis();
  const [tokens, setTokens] = useState();
  // const [token, setToken] = useState()
  const { fetch } = useMoralisCloudFunction(
    "getTokens",
    { token: "sum" },
    { autoFetch: false },
  );

  useMemo(() => {
    if (!Moralis) return null;
    fetch({
      onSuccess: (sum) => setTokens(sum),
      onError: (error) => console.log(error),
    });
  }, []);

  return { tokens };
};

export default useERC20Tokens;
