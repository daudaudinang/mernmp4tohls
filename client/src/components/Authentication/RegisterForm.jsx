import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

Register.propTypes = {};

function Register(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {handleRegister} = props;

    const changeUsername = (event) => {
        setUsername(event.target.value);
    }

    const changePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) =>{
        const dataRegister = {username, password};
        event.preventDefault();
        if(handleRegister) {
            handleRegister(dataRegister);
        }
    }

    return(
        <div className="form-log">
            <form onSubmit={handleSubmit}>
                <div className="form-inner">
                    <h2>Register</h2>
                    <div className="form-group">
                        <label htmlFor="username">Username: </label>
                        <input type="text" name="username" id="username" onChange={changeUsername}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">password: </label>
                        <input type="password" name="password" id="password" onChange={changePassword}/>
                    </div>
                    <button type="submit">Đăng ký</button>
                </div>
            </form>
            <Link to="/login">Đã có tài khoản? Đăng nhập ngay</Link>
        </div>
    );
}

export default Register;