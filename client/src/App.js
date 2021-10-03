import { login, logout } from "actions/login";
import authApi from "API/authApi";
import userApi from "API/userApi";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { resetListFile } from './actions/file';
import { resetListUser } from './actions/user';
import "./App.scss";
import LoginForm from "./components/Authentication/LoginForm";
import RegisterForm from "./components/Authentication/RegisterForm";
import Header from "./components/Header";
import ConvertFile from "./features/Converter/pages/ConvertFile";
import FileController from "./features/Converter/pages/FileController";
import { Logout } from './features/Converter/pages/Logout';
import UserController from "./features/Converter/pages/UserController";

function App() {
  const isLogin = useSelector((state) => state.login.isLogin);
  const [access_token, setAccess_token] = useState(null);
  const [message, setMessage] = useState("");
  const [account_type, setAccount_type] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Nếu người dùng cố tình refresh lại trình duyệt:
    if(localStorage.getItem("account_type")) {
      setAccount_type(localStorage.getItem("account_type"));
    }

    if(localStorage.getItem("refresh_token")) {
      const refreshToken = async () => {
        authApi.refreshToken()
          .then((response) => {
            if(response.status === 1) {
              localStorage.setItem("access_token", response.access_token);
              setAccess_token(response.access_token);
            }
            else console.log("Refresh Token Error!");
          })
          .catch((err) => console.log(err));
      }

      refreshToken();
    }
  },[])

  useEffect(() => {
    setTimeout(() => {
      authApi.refreshToken()
      .then((response) => {
        if(response.status === 1) {
          localStorage.setItem("access_token", response.access_token);
          setAccess_token(response.access_token);
        }
        else console.log("Refresh Token Error!");
      })
      .catch((err) => console.log(err));
    }, 30000);
  }, [isLogin, access_token]);

  const handleLogin = async (dataLogin) => {
    await authApi.login(dataLogin)
      .then((response) => {
        setMessage(response.message);
        if(response.status === 1){
          const actionLogin = login(dataLogin);
          dispatch(actionLogin);
          
          setAccess_token(response.access_token);
          // reset Message báo đăng nhập nếu đăng nhập thành công
          setMessage("");
          setAccount_type(response.account_type);

          localStorage.setItem("isLogin", true);
          localStorage.setItem("account_type", response.account_type);
          localStorage.setItem("username", response.username);
          localStorage.setItem("access_token", response.access_token);
          localStorage.setItem("refresh_token", response.refresh_token);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleRegister = async (dataRegister) => {
    await userApi.register(dataRegister)
      .then((response) => {
        setMessage(response.message);
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = async() => {
    await authApi.logout()
    .then((response) => {
      if(response.status === 1) {
        setAccess_token(null);
        setAccount_type(null);

        dispatch(resetListFile());
        dispatch(resetListUser());

        localStorage.clear();
        const actionLogout = logout();
        dispatch(actionLogout);
      }    
    })
  };

  if (isLogin) {
    if(account_type === "modifier"){
      return (
        <BrowserRouter>
          <Header headerType="modifier"/>
          <Switch>
            <Route path="/ConvertFile" component={ConvertFile} />
            <Route path="/FileController" component={FileController} />
            <Route path="/UserController" component={UserController} />
            <Route path="/logout">
                <Logout handleLogout={handleLogout}></Logout>
            </Route>
            <Redirect to="/convertFile" />
          </Switch>
        </BrowserRouter>
      );
    } else {
      return(
        <BrowserRouter>
        <Header headerType="normal"/>
        <Switch>
          <Route path="/ConvertFile" component={ConvertFile} />
          <Route path="/FileController" component={FileController} />
          <Route path="/logout">
                <Logout handleLogout={handleLogout}></Logout>
            </Route>
            <Redirect to="/convertFile" />
          </Switch>
        </BrowserRouter>
      )
    }
  } else {
    return (
      <BrowserRouter>
        <p className="message">{message}</p>
        <Switch>
          <Route path="/login">
            <LoginForm handleLogin={handleLogin} />
          </Route>
          <Route path="/register">
            <RegisterForm handleRegister={handleRegister} />
          </Route>
          <Redirect to="/login" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
