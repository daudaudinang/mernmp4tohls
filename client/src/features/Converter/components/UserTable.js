import React from 'react'
import { Link } from 'react-router-dom';

export const UserTable = ({dataUser, handleEdit, handleRemove}) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Account Type</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            {dataUser.map(oneUser => 
                <tr key={oneUser._id}>
                    <td>{oneUser._id}</td>
                    <td>{oneUser.account_type}</td>
                    <td>{oneUser.username}</td>
                    <td>{oneUser.password}</td>
                    <td><button><Link to={{pathname:`/UserController/edit/${oneUser._id}`}}> Sửa </Link></button> / <button onClick={handleRemove} id={oneUser._id} className="button-remove">Xoá</button></td>
                </tr>
            )}
            </tbody>
        </table>
    )
}
