import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function App() {
  // FOR REGISTRATION
  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState("");

  // FOR LOGIN
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //  USE STATE TO OUTPUT LOGIN ERROR ON SCREEN 
  const [loginStatus, setLoginStatus] = useState("");

  // SEEING THE SESSION IN THE FRONTEND
  axios.defaults.withCredentials = true;

  //  REGISTER
  const register = () => {
    axios.post('http://localhost:5000/register', {
      username: usernameReg, 
      password: passwordReg, 
    }).then((response) => {
      console.log(response);
    })
  }

  //  Login
  const login = () => {
    axios.post("http://localhost:5000/login", {
      username: username,
      password: password,
    }).then((response) => {

      if(response.data.message){
        setLoginStatus(response.data.message)   // GRABS THE DATA WHICH IS THE ERROR MESSAGE
      } else{
        setLoginStatus(response.data[0].username)    // IF CORRECT GRABS THE DATA AT ARRAY 0 AND THE USERNAME
      }
    })
  }

  // useEffect FOR SESSION
  useEffect(() => {
    axios.get("http://localhost:5000/login").then((response) => {
      //console.log(response);
      if (response.data.loggedIn === true){
      setLoginStatus(response.data.user[0].username);
      }
    })
  }, [])

  return (
    <div className="App">
      <div className="registration">
        <h1>Registration</h1>
        <label htmlFor="">Username</label>
        <input type="text" onChange={(e) => {setUsernameReg(e.target.value); }} />
        <label htmlFor="">Password</label>
        <input type="text" onChange={(e) => {setPasswordReg(e.target.value); }} />
        <button onClick={register} > Register</button>
      </div>


      <div className="login">
        <h1>Login</h1>
        <input type="text" placeholder="Username" onChange={(e) => {setUsername(e.target.value);}} />
        <input type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value);}} />
        <button onClick={login} > Login </button>
      </div>

      <h1>{loginStatus}</h1>
    </div>
  );
}

export default App;
