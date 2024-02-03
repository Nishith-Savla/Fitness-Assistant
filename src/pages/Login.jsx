import React, { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Login successful, redirect to dashboard or home page
                window.location.href = '/dashboard';
            } else {
                // Login failed, display error message
                const errorData = await response.json();
                setLoginError(errorData.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setLoginError('An error occurred while logging in. Please try again later.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {loginError && <p>{loginError}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
