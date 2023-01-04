import React, { useEffect } from 'react'
import { Link } from "react-router-dom";

const Header = ({ siteName, auth, logout }) => {
    const addEffect = () => {
        document.querySelector('#navbar').classList.add('glass-effect');
    }
    const removeEffect = () => {
        document.querySelector('#navbar').classList.remove('glass-effect');
    }

    const handleScroll = () => {
        (window.scrollY > 0) ? addEffect() : ((document.querySelector('.navbar-collapse').classList.contains('show')) ? addEffect() : removeEffect());
    }

    const handleClick = () => {
        if (document.querySelector('#navbar').classList.contains('glass-effect')) {
            removeEffect();
        } else {
            addEffect();
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const getFirstName = (name) => {
        return name.split(" ")[0];
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg fixed-top fw-bold" id='navbar'>
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">{siteName}</Link>
                    <button className="navbar-toggler" onClick={handleClick} type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 fw-bold">
                            <li className="nav-item me-2">
                                <Link to="/" className="nav-link active" aria-current="page">Home</Link>
                            </li>
                            {auth.token && <>
                                {auth.user.role === "user" && <>
                                    <li className="nav-item mb-2 me-2">
                                        <Link to="/sell" className="nav-link" aria-current="page">Sell Products</Link>
                                    </li>
                                    <li className="nav-item mb-2 me-2">
                                        <Link to="/buy" className="nav-link" aria-current="page">Buy Products</Link>
                                    </li>
                                </>}

                                <li className="nav-item dropdown me-2">
                                    <a className="nav-link dropdown-toggle dropdn" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Welcome, {getFirstName(auth.user.name)}
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><Link to={"/profile"} className="dropdown-item text-primary">My Profile</Link></li>
                                        {auth.user.role === "user" && <>
                                            <li><Link to={"/listing"} className="dropdown-item text-primary">My Listings</Link></li>
                                            <li><Link to={"/transaction"} className="dropdown-item text-primary">My Transactions</Link></li>
                                        </>}
                                        {auth.user.role === "admin" && <>
                                            <li><Link to={"/admin/members"} className="dropdown-item text-primary">All Users</Link></li>
                                            <li><Link to={"/admin/listings"} className="dropdown-item text-primary">All Listings</Link></li>
                                            <li><Link to={"/transaction"} className="dropdown-item text-primary">All Transactions</Link></li>
                                        </>}
                                        <li><a onClick={logout} className="dropdown-item text-danger fw-bold">Logout</a></li>
                                    </ul>
                                </li>
                            </>}
                            {!auth.token && <li className="nav-item me-2 mb-2">
                                <Link to="/login" className="btn btn-sm">Login</Link>
                            </li>}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header