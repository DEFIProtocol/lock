import { useEffect, useState } from "react";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";

const useOrders = (objectID) => {
  const { isAuthenticated } = useMoralis();
  const [userOrder, setUserOrder] = useState();
  // const [token, setToken] = useState()

  useEffect(() => {
    if (!isAuthenticated) return null;
    fetch({
      onSuccess: (orders) =>
        setUserOrder(orders.objectId == objectID?.objectID?.id),
      onError: (error) => console.log(error),
    });
  }, []);

  return { userOrder };
};

export default useOrders;
