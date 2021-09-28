import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

Login.propTypes = {};

function Login(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {handleLogin} = props;

    const changeUsername = (event) => {
        setUsername(event.target.value);
    }

    const changePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) =>{
        const dataLogin = {username, password};
        event.preventDefault();
        if(handleLogin) {
            handleLogin(dataLogin);
        }
    }

    return(
        <div className="form-log">
        <form onSubmit={handleSubmit}>
            <div className="form-inner">
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="username">Username: </label>
                    <input type="text" name="username" id="username" onChange={changeUsername}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">password: </label>
                    <input type="password" name="password" id="password" onChange={changePassword}/>
                </div>
                <button type="submit">Đăng nhập</button>
            </div>
        </form>
        <div><Link to="/register">Chưa có tài khoản? Đăng ký ngay</Link></div>
        </div>
    );
}

export default Login;