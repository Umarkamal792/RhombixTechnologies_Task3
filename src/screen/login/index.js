// src/screen/login

import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { login } from '../../config/firebase';
import './login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const signIn = async () => {
        try {
            const success = await login({ email, password });
            if (success) {
                navigate('/'); 
            }
        } catch (err) {
            setError(err.message); 
        }
    };

    return (
        <div className="login-form">
            <h2 className="login-heading">LogIn</h2>

            <input
                className="email-input"
                placeholder="Enter your Email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="password-input"
                placeholder="Enter your Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <br />
            <button className="login-button" onClick={signIn}>Login</button>

            <p className="signup-link">
                Don't have an account?
                <span className="signup-span" onClick={() => navigate("/register")}> Signup</span>
            </p>
        </div>
    );
}

export default Login;
