import React, { useState } from "react";
import "./login.scss";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "https://yankee-server.herokuapp.com/api/login";
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("authToken", res.data);
      window.location = "/";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  return (
    <div className="containerL">
      <div className="cardContainerL">
        <div className="yankeeLogoMobileContainer">Yankee Social</div>
        <div className="leftContainerL">
          <div className="loginHeaderL">Log In To Your Account</div>
          <form onSubmit={handleSubmit} className="logInFormL">
            {error && <div className="errorTextL">{error}!</div>}
            <input
              className="inputTagL"
              placeholder="Email"
              name="email"
              type="text"
              onChange={handleChange}
              value={data.email}
            />
            <input
              className="inputTagL"
              placeholder="Password"
              name="password"
              type="password"
              onChange={handleChange}
              value={data.password}
            />
            <button className="signInButtonL" type="submit">
              Sign In
            </button>
          </form>
        </div>
        <div className="rightContainerL">
          <div className="headerL">New Here?</div>
          <Link to="/signup">
            <button className="signUpButtonL">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
