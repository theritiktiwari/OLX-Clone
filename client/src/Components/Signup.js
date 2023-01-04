import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaCaretLeft } from 'react-icons/fa';

const Signup = ({ siteName, tst }) => {
    document.title = `Signup | ${siteName}`;
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (document.cookie.includes("olx-user") && document.cookie.split("olx-user=")[1].split(";")[0].length > 0)
            navigate("/");
    }, [window.location.pathname]);

    const handleChange = (e) => {
        if (e.target.name === "name")
            setName(e.target.value);
        else if (e.target.name === "email")
            setEmail(e.target.value);
        else if (e.target.name === "password")
            setPassword(e.target.value);
        else if (e.target.name === "confirmPassword")
            setConfirmPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (name && email && password && confirmPassword) {
            if (password === confirmPassword) {
                const data = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/newuser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        confirmPassword
                    })
                });
                const res = await data.json();
                if (res.type === "success") {
                    tst(res.message, "success");
                    document.cookie = `olx-user=${res.data}; path=/; expires=${new Date(Date.now() + 86400000)};`;
                    setTimeout(() => {
                        navigate("/");
                    }, 2000);
                    setName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
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
                tst("Password does not match", "error");
            }
        } else {
            tst("Please fill all the fields", "error");
        }
        setLoading(false);
    }

    return (
        <>
            <div className="back-to-home">
                <Link href={"/"}><a className='d-flex align-items-center'><FaCaretLeft /> Home</a></Link>
            </div>
            <section className='d-flex justify-content-center align-items-center h-full'>
                <form className='form container form-container glass-effect' onSubmit={handleSubmit} method="POST">
                    <h2 className='fw-bold mb-4 radiantText text-center fs-1 text-uppercase'>Register Yourself</h2>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" value={name} onChange={handleChange} placeholder='Enter your name' id="name" name='name' />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" value={email} onChange={handleChange} placeholder='student@vitstudent.ac.in' id="email" name='email' aria-describedby="emailHelp" style={{ textTransform: "lowercase" }} />
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" value={password} onChange={handleChange} placeholder='Enter your password' id="password" name='password' />
                        </div>
                        <div className="col">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" value={confirmPassword} onChange={handleChange} placeholder='Confirm your password' id="confirmPassword" name='confirmPassword' />
                        </div>
                    </div>
                    <button type="submit" disabled={loading && true} className="btn btn-main mt-2 w-100">{loading ? "Processing..." : "Signup"}</button>
                    <div className="d-flex justify-content-end align-items-center mt-3">
                        <Link to={"/login"}><a className='text-secondary'>Already an account ?</a></Link>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Signup