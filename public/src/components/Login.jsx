import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect } from 'react';
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import Logo from "../assets/logo.svg";
import { loginRoute } from "../utils/apiRoutes";


function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: ""
        , password: ""
    });

    // it will load first time and check if user is saved in local storage of browser then it will login automatically with its credentials
    // useEffect(()=>{
    //     if (localStorage.getItem("chat-app-user")){
    //         navigate("/");
    //     }
    // },[])

    const toastOptions = {
        position: "bottom-right",
        autoClose: "5000",
        pauseOnHover: true,
        draggable: true,
        theme: "dark"

    };

    const handleChange = (e) => {
        setValues({
            ...values, [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidations()) {
            const { password, username} = values;
            try {
                const { data } = await axios.post(loginRoute, {
                    username,
                    password
                });
                if (data.status === false) {
                    notifyError(data.msg);
                }
                if (data.status === true) {
                    localStorage.setItem("chat-app-user", JSON.stringify(data.user));
                    navigate("/");
                }
            } catch (error) {
                console.log("error " + error.message);
            }
        }
    }

    const notifyError = (msg) => {
        toast.error(msg, toastOptions)
    }

    const handleValidations = () => {
        const { password, username} = values;
        if (username.length === 0 || password.length===0) {
            notifyError("username and password is required");
            return false;
        }
        return true;
    }

    return (
        <>
            <FormContainer>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="brand">
                        <img src={Logo} alt="Logo" />
                        <h1>Chat It!</h1>
                    </div>
                    <input type="text" placeholder="Username" name="username" onChange={e => handleChange(e)} />
                    <input type="password" placeholder="Password" name="password" onChange={e => handleChange(e)} />

                    <button type="submit">Login</button>
                    <span>Don't have an account? <Link to="/register">Register</Link></span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );
}
export default Login;



const FormContainer = styled.div` 
// parent (whole page 100%x100%)
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #131324;
//   child-1 of parent
  form {
    //   border:solid white 1px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
//   child-1 Of Form
  .brand {
    // border:solid white 1px;
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  //   child-2,3,4 Of Form
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  //   child-5 Of Form
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    // &:hover {
    //   background-color: #4e0eff;
    // }
  }
  //   child-6 Of Form
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  } `;

