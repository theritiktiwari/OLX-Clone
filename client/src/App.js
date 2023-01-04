import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Listings from "./Components/admin/Listings";
import Members from "./Components/admin/Members";
import Buy from "./Components/Buy";
import Error from "./Components/Error";
import Navbar from "./Components/Header";
import Landing from "./Components/Landing";
import Listing from "./Components/Listing";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import Reset from "./Components/Reset";
import Sell from "./Components/Sell";
import Signup from "./Components/Signup";
import Transaction from "./Components/Transaction";

function App({ siteName }) {
  document.title = `Home | ${siteName}`;
  const navigate = useNavigate();

  const [auth, setAuth] = useState({ user: null, token: null });
  const [key, setKey] = useState();
  const [error, setError] = useState();
  const [msg, setMsg] = useState();
  const [hideElement, setHideElement] = useState(false);

  useEffect(() => {
    // Check if the cookie is enabled
    if (!navigator.cookieEnabled) {
      setError("Cookies are disabled");
      setMsg("Please enable cookies to continue.");
    }

    // Check if the user is logged in
    if (document.cookie.includes("olx-user") && document.cookie.split("olx-user=")[1].split(";")[0].length > 0) {
      const data = document.cookie.split("olx-user=")[1].split(";")[0];
      // get the user details
      const getUser = async () => {
        if (navigator.onLine) {
          const req = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/getuser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": data
            }
          });
          const res = await req.json();
          if (res.type === "success") {
            setAuth({ user: res.data, token: data });
            setKey(Math.random());
          } else {
            setAuth({ user: null, token: null });
            setKey(Math.random());
          }
        }
      }
      getUser();
    } else {
      setAuth({ user: null, token: null });
      setKey(Math.random());
    }

    if (window.location.pathname === "/login" || window.location.pathname === "/signup" || window.location.pathname === "/reset") {
      setHideElement(true);
    } else {
      setHideElement(false);
    }
  }, [window.location.pathname]);

  // Logout function
  const logout = () => {
    document.cookie = "olx-user=; path=/;";
    setAuth({ user: null, token: null });
    setKey(Math.random());
    navigate("/");
  }

  // Function for notifications
  const tst = (msg, type) => {
    const data = {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark"
    }
    if (type == "success") {
      toast.success(`${msg}`, data);
    } else {
      toast.error(`${msg}`, data);
    }
  }

  return (
    <>
      {error && msg && <Error siteName={siteName} error={error} msg={msg} />}
      {key && !hideElement && <Navbar siteName={siteName} auth={auth} logout={logout} />}
      <Routes>
        <Route exact path="/" element={<Landing siteName={siteName} />} />
        <Route exact path="/login" element={<Login siteName={siteName} tst={tst} />} />
        <Route exact path="/signup" element={<Signup siteName={siteName} tst={tst} />} />
        <Route exact path="/reset" element={<Reset siteName={siteName} tst={tst} />} />
        <Route exact path="/sell" element={<Sell siteName={siteName} tst={tst} auth={auth} />} />
        <Route exact path="/buy" element={<Buy siteName={siteName} tst={tst} auth={auth} />} />
        <Route exact path="/profile" element={<Profile siteName={siteName} auth={auth} />} />
        <Route exact path="/listing" element={<Listing siteName={siteName} auth={auth} />} />
        <Route exact path="/transaction" element={<Transaction siteName={siteName} auth={auth} />} />
        <Route exact path="/admin/listings" element={<Listings siteName={siteName} auth={auth} />} />
        <Route exact path="/admin/members" element={<Members siteName={siteName} auth={auth} />} />
        <Route path="*" element={<Error siteName={siteName} error="404" msg="Page not found" />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
