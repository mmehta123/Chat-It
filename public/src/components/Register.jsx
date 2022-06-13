import { Link,useNavigate } from "react-router-dom";
import { useState } from 'react';
import styled from "styled-components";
import {ToastContainer,toast} from "react-toastify";
import axios from "axios";
import Logo from "../assets/logo.svg";
import "react-toastify/dist/ReactToastify.css"
import "./css/register.css"
import { registerRoute } from "../utils/apiRoutes";


function Register() {
  const navigate=useNavigate();
    const [values, setValues] = useState({
        username: "",
        email: ""
        , password: ""
        , confirmPassword: ""
    });

    const toastOptions={
        position:"bottom-right",
        autoClose:"5000",
        pauseOnHover:true,
        draggable:true,
        theme:"dark"
        
    };

    const handleChange = (e) => {
        setValues({
            ...values, [e.target.name]: e.target.value
        })

    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(handleValidations()){
          const { password, username, email } = values;
          try {
            const {data}=await axios.post(registerRoute,{
              username,
              email,
              password
            });
            if(data.status===false){
              notifyError(data.msg);
            }
            if(data.status===true){
              localStorage.setItem("chat-app-user",JSON.stringify(data.user));
              navigate("/");
            }
          } catch (error) {
            console.log("error "+error.message)
          }
        }
    }

    const notifyError=(msg)=>{
        toast.error(msg,toastOptions)
    }

    const handleValidations=()=>{
        const {password,confirmPassword,username,email}=values;
        if(username.length<6){
            notifyError("username should be of atleast 6 characters");
            return false;
        }
        else if(email===""){
            notifyError("email is required");
            return false;
        }
        else if(password.length<6){
            notifyError("password length should be of atleast 6 characters");
            return false;
        }
        else if(password!==confirmPassword){
            notifyError("password and confirm password mismatched");
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
                    <input type="email" placeholder="Email" name="email" onChange={e => handleChange(e)} />
                    <input type="password" placeholder="Password" name="password" onChange={e => handleChange(e)} />
                    <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={e => handleChange(e)} />

                    <button type="submit">Create Account</button>
                    <span>Already have an account? <Link to="/login">Login</Link></span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );
}
export default Register;



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

