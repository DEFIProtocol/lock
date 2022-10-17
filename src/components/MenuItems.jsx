import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import { useMoralis } from "react-moralis";

function MenuItems() {
  const { Moralis, isAuthenticated } = useMoralis();
  const { pathname } = useLocation();
  const [admin, setAdmin] = useState();

  const getAdmin = useCallback(async () => {
    if (!isAuthenticated) return null;
    const user = await Moralis.User.current();
    let admin = user.get("Admin");
    setAdmin(admin);
  }, [Moralis, isAuthenticated]);

  useEffect(() => {
    getAdmin();
  }, [getAdmin]);

  return (
    <>
      <Menu
        theme="light"
        mode="horizontal"
        style={{
          display: "flex",
          fontSize: "17px",
          fontWeight: "500",
          width: "100%",
          backgroundColor: "#202020",
          borderBottom: "10px solid black",
        }}
        defaultSelectedKeys={[pathname]}
      >
        <Menu.Item key="/Home">
          <NavLink
            to="/Home"
            style={{ marginLeft: "0px", marginRight: "15px", float: "left" }}
          >
            <h1 style={{ color: "lime", display: "inline-block" }}>grid</h1>
            <h1 style={{ color: "white", display: "inline-block" }}>Lock</h1>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/Home">
          <NavLink to="/Home" style={{ color: "lime" }}>
            Home
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/ETHDEX">
          <NavLink to="/ETHDEX" style={{ color: "lime" }}>
            DEX
          </NavLink>
        </Menu.Item>
        {!isAuthenticated ? null : (
          <Menu.Item key="/wallet">
            <NavLink to="/wallet" style={{ color: "lime" }}>
              Account
            </NavLink>
          </Menu.Item>
        )}
        {admin == true ? (
          <Menu.Item key="/admin">
            <NavLink to="/admin" style={{ color: "lime" }}>
              Admin
            </NavLink>
          </Menu.Item>
        ) : null}
      </Menu>
    </>
  );
}

export default MenuItems;
