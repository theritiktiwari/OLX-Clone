import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Sell = ({ siteName, tst, auth }) => {
    document.title = `Sell | ${siteName}`;

    const [name, setName] = useState();
    const [price, setPrice] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.user) {
            navigate('/login');
        }
    }, [window.location.pathname]);

    const handleChange = (e) => {
        if (e.target.name === "name")
            setName(e.target.value);
        else if (e.target.name === "price") {
            if (e.target.value > 5000)
                return tst("Price cannot be greater than 5000", "error");
            if (e.target.value < 0)
                return tst("Price cannot be less than 0", "error");
            setPrice(e.target.value);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (name && price) {
            const data = await fetch(`${process.env.REACT_APP_API_URL}/api/listing/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": auth.token
                },
                body: JSON.stringify({
                    name,
                    price,
                    seller_name: auth.user.name,
                    user_id: auth.user._id
                })
            });
            const res = await data.json();
            if (res.type === "success") {
                tst(res.message, "success");
                setName("");
                setPrice("");
            } else {
                tst(res.message, "error");
            }
        } else {
            tst("Please fill all the fields", "error");
        }
        setLoading(false);
    }

    return (
        <>
            <section className='d-flex justify-content-center align-items-center h-full'>
                <form className='form container form-container glass-effect' onSubmit={handleSubmit} method="POST">
                    <h2 className='fw-bold mb-4 radiantText text-center fs-1 text-uppercase'>List your Product</h2>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Product name</label>
                        <input type="text" className="form-control" value={name} onChange={handleChange} placeholder='Enter the product name' id="name" name='name' />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">Product price</label>
                        <input type="number" min={0} max={5000} className="form-control" value={price} onChange={handleChange} placeholder='Enter the product price' id="price" name='price' />
                    </div>
                    <button type="submit" disabled={loading && true} className="btn btn-main mt-2 w-100">{loading ? "Processing..." : "List Now"}</button>
                </form>
            </section>
        </>
    )
}

export default Sell