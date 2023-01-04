import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const Profile = ({ siteName, auth }) => {
    document.title = `Profile | ${siteName}`;
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.user) {
            navigate("/login");
        }
    }, [window.location.pathname]);

    return (
        <>
            <section className='mt-5 pt-5'>
                <h1 className='title text-center fw-bold text-uppercase mb-4 radiantText'>Your profile</h1>
                {auth.user ? <div className='mt-5 pt-5 d-flex justify-conent-center align-items-center'>
                    <div className='container-md'>
                        <div className='table-responsive'>
                            <table className="table text-primary">
                                <tbody>
                                    {auth.user.name && <tr>
                                        <th><h4>Name</h4></th>
                                        <td><h4 className="ms-3 text-secondary fw-bold">{auth.user.name}</h4></td>
                                    </tr>}
                                    {auth.user.email && <tr>
                                        <th><h4>Email address</h4></th>
                                        <td><h4 className="ms-3 text-secondary fw-bold">{auth.user.email}</h4></td>
                                    </tr>}
                                    {auth.user.role && <tr>
                                        <th><h4>Your role</h4></th>
                                        <td><h4 className="ms-3 text-secondary text-capitalize fw-bold">{auth.user.role}</h4></td>
                                    </tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div> : <Loader />}
            </section>
        </>
    )
}

export default Profile