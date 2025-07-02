import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const role = sessionStorage.getItem("UserRole"); 
        if (role === "admin") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, []);

    function handleLogout() {
        sessionStorage.removeItem("UserID");
        sessionStorage.removeItem("UserRole"); 
        setUser(null);
        navigate("/");
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <div className="d-flex align-items-center gap-2">
                    <Link to="/" className="navbar-brand">Our Blogs</Link>
                    {isAdmin && (
                        <span className="badge text-bg-danger">Admin</span> 
                    )}
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav gap-3">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/Newpost" className="nav-link">New Blog</Link>
                        </li>
                        {user && (
                            <li className="nav-item">
                                <Link to="/Myposts" className="nav-link">My Blogs</Link>
                            </li>
                        )}
                        {isAdmin && (
                            <li className="nav-item">
                                <span className="nav-link fw-bold text-danger">Admin Dashboard</span> 
                            </li>
                        )}
                    </ul>
                    <div className="ms-auto">
                        {user ? (
                            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                        ) : (
                            <Link to="/Login" className="btn btn-primary">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
