import userApi from 'API/userApi';
import Banner from 'components/Banner';
import Images from 'constants/images';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import 'reactstrap';
import AddUser from '../components/AddUser';
import EditUser from '../components/EditUser';
import { UserTable } from '../components/UserTable';
import { removeUser, saveUser } from './../../../actions/user';
import "./style.css";

UserController.propTypes = {

}

function UserController(props) {

    const history = useHistory();
    const match = useRouteMatch();

    const listUser = useSelector(state => state.user.listUser);
    const dispatch = useDispatch();

    const [message, setMessage] = useState(null);
    const [changeData, setChangeData] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            await userApi.getUserList()
            .then((response) => {
                setMessage(response.message);
                if(response.status === 1) {
                    const actionSaveUser = saveUser(response.userList);
                    dispatch(actionSaveUser);
                }
                else console.log(response.message);
            })
        }
        fetchData();
    }, [changeData]);

    const handleAdd = async (dataUserAdd) => {
        await userApi.addUser(dataUserAdd)
        .then((response) => {
            setMessage(response.message);
            if(response.status === 1) {
                setChangeData(changeData + 1);
                history.push('/UserController/view');
            }
        })
        .catch((err) => console.log(err));
    }

    const handleEdit = async (dataEdit) => {
        await userApi.editUser(dataEdit)
        .then((response) => {
            setMessage(response.message);
            if(response.status === 1){
                setChangeData(changeData + 1);
                history.push('/UserController/view');
            }
        })
        .catch((err) => console.log(err));
    }

  const handleRemove = (event) => {
    event.preventDefault();

    const newList = listUser.filter(item => item._id !== event.target.id);

    const actionRemoveUser = removeUser(newList);
    dispatch(actionRemoveUser);

    const fetchData = async () => {
        await userApi.removeUser(event.target.id)
        .then((response) => {
            setMessage(response.message);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    fetchData();
  }

    return (
        <>
        <Banner title="User Controller 🎉" backgroundUrl={Images.COLORFUL_BG} message={message}/>
        <div className="main-container-user">
            <div className="left-container-user">
                <Link to='/UserController/view'>View List User</Link>
                <Link to='/UserController/add'>Add A New User</Link>
            </div>
            <div className="right-container">
            <Switch>
                <Route path={`${match.url}/view`}>
                    <UserTable dataUser={listUser} handleRemove={handleRemove}/>
                </Route>
                <Route path={`${match.url}/edit/:id`}>
                    <EditUser handleEdit={handleEdit} setMessage={setMessage}></EditUser>
                </Route>
                <Route path={`${match.url}/add`}>
                    <AddUser handleAdd={handleAdd} setMessage={setMessage}></AddUser>
                </Route>
                <Redirect to={`${match.url}/view`} />
            </Switch>
            </div>
        </div>
        </>
    )
}

export default UserController

