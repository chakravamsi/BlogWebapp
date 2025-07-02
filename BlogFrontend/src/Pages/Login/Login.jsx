import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Login.css'
const baseURL = import.meta.env.VITE_API_BASE;
function Login({ setUser }) {
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    })
    function handleInput(e) {
        let value = e.target.value;
        let fieldName = e.target.name;
        setLoginForm(prev => ({
            ...prev,
            [fieldName]: value
        }))
    }
    function login() {
        fetch(`${baseURL}/user/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginForm)
        })
            .then(data => {
                return data.json()
            })
            .then(data => {
                if (data.isMatched) {
                    sessionStorage.setItem("UserID", data.UserID);
                    sessionStorage.setItem("UserRole", data.role); 
                    setUser(data.UserID);
                    window.location.href = "/";
                } else {
                    alert("Wrong password");
                }
            })
    }
    return (
        <div className="login-page">
            <form className="login-form d-flex flex-column row-gap-2
            justify-content-center">
                <h1>Please Login</h1>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" name="email" onChange={handleInput} value={loginForm.email} />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password" name="password" onChange={handleInput} value={loginForm.password} />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <button className="btn btn-primary w-100" type="button" onClick={login}>Login</button>
                <p className="text-center">Doesn't have an account? <span className="text-blue-500 underline"> <Link to={'/Registration'}>Register</Link> </span></p>
            </form>
        </div>
    )

}

export default Login;