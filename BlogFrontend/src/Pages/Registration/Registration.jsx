import React, { useState } from "react";
import './Registration.css'
import { Link } from "react-router-dom";
const baseURL = import.meta.env.VITE_API_BASE;
function Registration() {
    const [registrationDetails,setResgistrationDetails] = useState({
        name : '',
        phoneNumber:'',
        emailAddress:'',
        password:''
    })
    function handleInput(e){
        let value = e.target.value;
        let fieldName = e.target.name;
        setResgistrationDetails(prev=>({
            ...prev,
            [fieldName]: value
        }))
    }
    function Register(){
        fetch(`${baseURL}/user/registration`,{
            method:'POST',
            headers : {
                "Content-Type" : "application/json",
            },
            body:JSON.stringify(registrationDetails)
    })
    .then(res =>{
        if(!res.ok){
            return res.text().then(msg => { throw new Error(msg); });
        }
        return res.json();
    })
    .then(data=>{
        setResgistrationDetails({
            name:"",
            phoneNumber:"",
            emailAddress:"",
            password:""
        });
        alert("Registration successful!");
    })
    .catch(err =>{
        alert(err.message)
    });
}
    return (
        <div className="login-page">
            <form className="login-form d-flex flex-column row-gap-2
            justify-content-center">
                <h1>Please Register</h1>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="nameInput" placeholder="" name="name"onChange={handleInput} value={registrationDetails.name}/>
                    <label htmlFor="nameInput">Name</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="tel" className="form-control" id="phoneInput" placeholder="" name="phoneNumber" onChange={handleInput} value={registrationDetails.phoneNumber}/>
                    <label htmlFor="phonegInput">Phone Number</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="emailInput" placeholder="name@example.com" name="emailAddress" onChange={handleInput} value={registrationDetails.emailAddress}/>
                    <label htmlFor="emailInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password" name="password"onChange={handleInput} value={registrationDetails.password}/>
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <button className="btn btn-primary w-100" type="button" onClick={Register}>Register</button>
                <p className="text-center">Already have an account? <span className="text-blue-500 underline"> <Link to={'/Login'}>Login</Link> </span></p>
            </form>
        </div>
    )

}

export default Registration;