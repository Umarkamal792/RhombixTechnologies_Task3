// src/screen/register/index.js

import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { register } from '../../config/firebase';
import './register.css';

function Register() {
    const navigate = useNavigate();
    const [fullname, setFullname] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const signup = async () => {
        try {
            const success = await register({ fullname, age, email, password });
            if (success) {
                navigate('/'); 
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="registration-form">
            <h2 className="h2">Register</h2>

            <input
                className="input"
                placeholder="Full Name"
                type="text"
                onChange={(e) => setFullname(e.target.value)}
            />
            <input
                className="input"
                placeholder="Enter your Age"
                type="date"
                onChange={(e) => setAge(e.target.value)}
            />
            <input
                className="input"
                placeholder="Enter your Email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="input"
                placeholder="Enter your Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button className="button" onClick={signup}>Signup</button>

            <p className="p">
                Already have an account? 
                <span onClick={() => navigate("/login")}> Login</span>
            </p>
        </div>
    );
}

export default Register;
