import { useContext, useRef } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
//import CircularProgress from '@mui/material/CircularProgress';
import { useHistory } from "react-router";
import { Link } from 'react-router-dom'


export default function Login() {
  const history = useHistory();
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    console.log('YOU SUCCESSFULLY TRIED')
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch,
      history.push("/")

    );
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Concert Connect</h3>
          <span className="loginDesc">
          Where concerts unite and memories resonate
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {/* {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )} */}
              Log In
            </button>
            <span className="loginForgot">Forgot Password?</span>
            
              <Link to='/register' className="registerAlign">
              <button className="loginRegisterButton">
                {/* {isFetching ? (
                  <CircularProgress color="white" size="20px" />
                ) : (
                 "Create a New Account"
                )} */}
                Create a New Account
              </button>
              </Link>
            
          </form>
        </div>
      </div>
    </div>
  );
}
