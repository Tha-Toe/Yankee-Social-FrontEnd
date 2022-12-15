import React, { useState } from "react";
import "./signUp.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ApiUrls } from "../../api/ApiUrls";

function SignUp() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = ApiUrls.apiUrl + ApiUrls.signUpUrl;
      const { data: res } = await axios.post(url, data);
      setError(res.message);
      navigate("/login");
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
    <div className="containerS">
      <div className="cardContainerS">
        <div className="leftContainerS">
          <div className="headerS">Already have an account?</div>
          <Link to="/login">
            <button className="signUpButtonS">Log In</button>
          </Link>
        </div>
        <div className="rightContainerS">
          <div className="loginHeaderS">Create Yankee Account</div>
          <form onSubmit={handleSubmit} className="logInFormS">
            {error && <div className="errorTextS">{error}!</div>}
            <input
              className="inputTagS"
              placeholder="First Name"
              name="firstName"
              type="text"
              onChange={handleChange}
              value={data.firstName}
            />
            <input
              className="inputTagS"
              placeholder="Last Name"
              name="lastName"
              type="text"
              onChange={handleChange}
              value={data.lastName}
            />
            <input
              className="inputTagS"
              placeholder="Email"
              name="email"
              type="text"
              onChange={handleChange}
              value={data.email}
            />
            <input
              className="inputTagS"
              placeholder="Password"
              name="password"
              type="password"
              onChange={handleChange}
              value={data.password}
            />
            <button className="signInButtonS" type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
