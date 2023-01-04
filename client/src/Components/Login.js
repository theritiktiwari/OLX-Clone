import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { FaCaretLeft } from 'react-icons/fa';

const Login = ({ siteName, tst }) => {
  document.title = `Login | ${siteName}`;
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (document.cookie.includes("olx-user") && document.cookie.split("olx-user=")[1].split(";")[0].length > 0)
      navigate("/");
  }, [window.location.pathname]);

  const handleChange = (e) => {
    if (e.target.name === "email")
      setEmail(e.target.value);
    else if (e.target.name === "password")
      setPassword(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (email && password) {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }); 
      const res = await data.json();
      if (res.type === "success") {
        tst(res.message, "success");
        document.cookie = `olx-user=${res.data}; path=/; expires=${new Date(Date.now() + 86400000)};`;
        setTimeout(() => {
          navigate("/");
        }, 2000);
        setEmail("");
        setPassword("");
      } else {
        if (Array.isArray(res.message)) {
          (res.message).forEach(error => {
            tst(error.msg, "error");
          });
        } else {
          tst(res.message, "error");
        }
      }
    } else {
      tst("Please fill all the fields", "error");
    }
    setLoading(false);
  }
  return (
    <>
      <div className="back-to-home">
        <Link to={"/"} className='d-flex align-items-center'><FaCaretLeft /> Home</Link>
      </div>
      <section className='d-flex justify-content-center align-items-center h-full'>
        <form className='form form-container container glass-effect' onSubmit={handleSubmit} method="POST">
          <h2 className='fw-bold mb-4 radiantText text-center fs-1 text-uppercase'>Login your account</h2>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" value={email} onChange={handleChange} placeholder='user@example.com' id="email" name='email' aria-describedby="emailHelp" style={{ textTransform: "lowercase" }} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={handleChange} placeholder='Enter your password' id="password" name='password' />
          </div>
          <button type="submit" disabled={loading && true} className="btn btn-main mt-2 w-100">{loading ? "Processing..." : "Login"}</button>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Link to={"/reset"} className="text-secondary">Forget password ?</Link>
            <Link to={"/signup"} className='text-secondary'>New User ?</Link>
          </div>
        </form>
      </section>
    </>
  )
}

export default Login