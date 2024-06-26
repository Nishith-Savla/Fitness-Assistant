import React, { useState } from "react";
import { Cookies } from "react-cookie";
import "./auth.css";

function Auth({ isLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const cookies = new Cookies();

  const handleAuth = async () => {
    try {
      const url = isLogin
        ? "https://df88-182-76-21-121.ngrok-free.app/login"
        : "https://df88-182-76-21-121.ngrok-free.app/signup";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        cookies.set("user_id", userData.user_id); // Save user_id in cookies
        if (isLogin) {
          window.location.href = "/userdashboard";
        } else {
          window.location.href = "/profile";
        }
      } else {
        const errorData = await response.json();
        setLoginError(errorData.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginError(
        "An error occurred while logging in. Please try again later."
      );
    }
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? "Login" : "Signup"}</h1>
      {loginError && <p className="error-message">{loginError}</p>}
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
      <button onClick={handleAuth} className="auth-button">
        {isLogin ? "Login" : "Signup"}
      </button>
    </div>
  );
}

export default Auth;
