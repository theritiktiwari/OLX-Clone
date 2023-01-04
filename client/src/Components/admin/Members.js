import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';

const Members = ({ siteName, auth }) => {
    document.title = `Members | ${siteName}`;
    const [getData, setGetData] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.user) {
            navigate('/login')
        }

        const getDetails = async () => {
            const req = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": auth.token
                }
            });
            const res = await req.json();
            if (res.type === "success") {
                setGetData(res.data);
            }
        }
        auth.user && getDetails();
    }, [window.location.pathname]);

    return (
        <>
            <section className='my-5 pt-5'>
                <h1 className='text-center fw-bold text-uppercase mb-5'>All Members</h1>
                {getData ? <div className='container d-flex justify-conent-center align-items-center'>
                    {(getData.length > 0) ? <div className='table-responsive mb-4 container'>
                        <table className="table text-primary text-center align-middle">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Name</th>
                                    <th>Email address</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getData.map((data, index) => {
                                    return (<tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className='min-width-120'>{data.name}</td>
                                        <td className='min-width-200'>{data.email}</td>
                                        <td className='min-width-200'>{data.role}</td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div> : <div className="d-flex w-100 justify-content-center align-items-center" style={{ height: "50vh" }}>
                        <div>
                            <h4 className='text-center w-100 fw-bold mb-4 text-secondary pb-4'>There are no members.</h4>
                        </div>
                    </div>}
                </div> : <Loader />}
            </section>
        </>
    )
}

export default Members