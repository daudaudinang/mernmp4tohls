import React from 'react'

const BASEURL = process.env.REACT_APP_BASE_URL_API_DATA_SERVER;

export const FileTable = ({dataFile, handleRemove}) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>File Upload</th>
                    <th>File Converted</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            {dataFile.map(oneVideo => 
                <tr key={oneVideo._id}>
                    <td>{oneVideo._id}</td>
                    <td>{oneVideo.username}</td>
                    <td><a href={BASEURL + "/" + oneVideo._id + "/tai-file-upload"} target="_blank" rel="noopener noreferrer">{oneVideo.file_upload}</a></td>
                    <td><a href={BASEURL + "/" + oneVideo._id + "/tai-file-convert"} target="_blank" rel="noopener noreferrer">{oneVideo.file_converted}</a></td>
                    <td><button onClick={handleRemove} id={oneVideo._id} className="button-remove">Xoá</button></td>
                </tr>
            )}
            </tbody>
        </table>
    )
}
