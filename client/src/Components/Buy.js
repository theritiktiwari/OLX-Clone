import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Loader from './Loader';

const Buy = ({ siteName, tst, auth }) => {
    document.title = `Buy | ${siteName}`;
    const [getData, setGetData] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.user) {
            navigate('/login')
        }

        const getDetails = async () => {
            const req = await fetch(`${process.env.REACT_APP_API_URL}/api/listing/all`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": auth.token
                }
            });
            const res = await req.json();
            if (res.type === "success") {
                const filteredData = res.data.filter((data) => data.status !== "sold");
                setGetData(filteredData);
            }
        }
        auth.user && getDetails();
    }, [window.location.pathname]);

    const buyProduct = async (prod) => {
        setLoading(true);
        const confirmation = window.confirm("Are you sure you want to buy this product?");
        if (confirmation) {
            if (prod.status === "sold")
                tst("This product is already sold", "error");
            else if (prod.user_id === auth.user._id)
                tst("You cannot buy your own product", "error");
            else {
                const data = await fetch(`${process.env.REACT_APP_API_URL}/api/purchase/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": auth.token
                    },
                    body: JSON.stringify({
                        item_id: prod._id,
                        buyer_id: auth.user._id,
                        buyer_name: auth.user.name
                    })
                });
                const res = await data.json();
                if (res.type === "success") {
                    tst(res.message, "success");
                    setTimeout(() => {
                        navigate('/transaction');
                    }, 1500);
                } else {
                    tst(res.message, "error");
                }
            }
        }
        setLoading(false);
    }

    return (
        <>
            <section className='my-5 pt-5'>
                <h1 className='text-center fw-bold text-uppercase mb-5'>All Products</h1>
                {getData ? <div className='container d-flex justify-conent-center align-items-center'>
                    {(getData.length > 0) ? <div className='table-responsive mb-4 container'>
                        <table className="table text-primary text-center align-middle">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Product Name</th>
                                    <th>Product Price(₹)</th>
                                    <th>Seller Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getData.map((data, index) => {
                                    return (<tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className='min-width-120'>{data.name}</td>
                                        <td className='min-width-200'>{data.price}</td>
                                        <td className='min-width-200'>{data.seller_name}</td>
                                        <td className='py-3'>
                                            <button onClick={(e) => buyProduct(data)} disabled={loading && true} className="btn-sm">{loading ? "Processing..." : "Buy Now"}</button>
                                        </td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div> : <div className="d-flex w-100 justify-content-center align-items-center" style={{ height: "50vh" }}>
                        <div>
                            <h4 className='text-center w-100 fw-bold mb-4 text-secondary pb-4'>There are no listed products.</h4>
                        </div>
                    </div>}
                </div> : <Loader />}
            </section>
        </>
    )
}

export default Buy