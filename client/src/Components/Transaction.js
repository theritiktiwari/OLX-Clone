import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Loader from './Loader';

const Transaction = ({ siteName, auth }) => {
    document.title = `Transactions | ${siteName}`;
    const [getData, setGetData] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.user) {
            navigate('/login')
        }

        const getDetails = async () => {
            const req = await fetch(`${process.env.REACT_APP_API_URL}/api/purchase/all`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": auth.token
                }
            });
            const res = await req.json();
            if (res.type === "success") {
                // const filteredData = res.data.filter((data) => data.user_id === auth.user._id);
                // console.log(filteredData);
                setGetData(res.data);
            }
        }
        auth.user && getDetails();
    }, [window.location.pathname]);

    return (
        <>
            <section className='my-5 pt-5'>
                <h1 className='text-center fw-bold text-uppercase mb-5'>All Transactions</h1>
                {getData ? <div className='container d-flex justify-conent-center align-items-center'>
                    {(getData.length > 0) ? <div className='table-responsive mb-4 container'>
                        <table className="table text-primary text-center align-middle">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Product Name</th>
                                    <th>Product Price(₹)</th>
                                    <th>Seller Name</th>
                                    <th>Buyer Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getData.map((data, index) => {
                                    return (<tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className='min-width-120'>{data.item_name}</td>
                                        <td className='min-width-200'>{data.item_price}</td>
                                        <td className='min-width-200'>{data.seller_name}</td>
                                        <td className='min-width-200'>{data.buyer_name}</td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div> : <div className="d-flex w-100 justify-content-center align-items-center" style={{ height: "50vh" }}>
                        <div>
                            <h4 className='text-center w-100 fw-bold mb-4 text-secondary pb-4'>You didn&apos;t do any transaction.</h4>
                        </div>
                    </div>}
                </div> : <Loader />}
            </section>
        </>
    )
}

export default Transaction