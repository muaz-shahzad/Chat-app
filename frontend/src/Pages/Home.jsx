import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setOnlineUser,setSocketConnection } from "../Redux/userSlice";
import logo from "../assets/logo.png";
import Sidebar from "../Component/Sidebar";
import io from "socket.io-client";
import { getCookie } from "../Utils/getCookie";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const location = useLocation();

  console.log("User", user);
  useEffect(() => {
    const token = getCookie("token");
    console.log("token: ", token);
    if (token) {
      const socketConnection = io("http://localhost:8000", {
        auth: {
          token: token,
        },
      });

      socketConnection.on("onlineUser", (data) => {
        console.log("data ", data);
        dispatch(setOnlineUser(data));
      });

      dispatch(setSocketConnection(socketConnection));

      return () => {
        socketConnection.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/users/userinfo",
          {
            withCredentials: true,
          }
        );
        dispatch(setUser(response.data));
      } catch (error) {
        setError("Error fetching user info");
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const basePath = location.pathname === "/";

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div>
          <img src={logo} width={250} alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500">
          Select user to send message
        </p>
      </div>

      {/**message component**/}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
