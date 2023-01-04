import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { FaCaretLeft } from 'react-icons/fa';

const Reset = ({ siteName, tst }) => {
    document.title = `Reset Password | ${siteName}`;
    const [email, setEmail] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (document.cookie.includes("olx-user") && document.cookie.split("olx-user=")[1].split(";")[0].length > 0)
            navigate("/");
    }, [window.location.pathname]);

    const handleChange = (e) => {
        if (e.target.name === "email")
            setEmail(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (email) {
            tst("Email sent to reset the password", "success");
            setEmail("");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
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
                    <h2 className='fw-bold mb-4 radiantText text-center fs-1 text-uppercase'>Reset your Password</h2>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" value={email} onChange={handleChange} placeholder='user@example.com' id="email" name='email' aria-describedby="emailHelp" style={{ textTransform: "lowercase" }} />
                    </div>
                    <button type="submit" disabled={loading && true} className="btn btn-main mt-2 w-100">{loading ? "Processing..." : "Reset Now"}</button>
                    <div className="d-flex justify-content-end align-items-center mt-3">
                        <Link to={"/login"}><a className='text-secondary'>Back to Login ?</a></Link>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Reset