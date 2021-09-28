import FileApi from 'API/fileApi';
import Banner from 'components/Banner';
import Images from 'constants/images';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'reactstrap';
import { removeFile, saveFile } from './../../../actions/file';
import { FileTable } from './../components/FileTable';
import "./style.css";

function ConvertFile(props) {
    const listFile = useSelector(state => state.file.listFile);
    const dispatch = useDispatch();

    const [video, setVideo] = useState(null);
    const [message, setMessage] = useState(null);
    const [changeData, setChangeData] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            await FileApi.getListFile()
            .then((response) => {
                if(response.status === 1) {
                    const actionSaveFile = saveFile(response.listFile);
                    dispatch(actionSaveFile);
                }
                else console.log(response.message);
            })
        }
        fetchData();
   }, [changeData]);


   const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Đang convert... Vui lòng chờ!")
    if(video === null) setMessage("Bạn phải chọn video muốn convert!");
    else {
        const formData = new FormData();
        formData.append("video", video);

        const fetchData = async () => {
            FileApi.uploadFile(formData)
            .then((response) => {
                setMessage(response.message);
                if(response.status === 1) {
                    setChangeData(changeData + 1);
                }
            })
            .catch(err => console.log(err));
        }

        fetchData();
    }
    
  }

  const handleChange = (event) => {
    const file = event.target.files[0];
    setVideo(file);
  }

  const handleRemove = (event) => {
    event.preventDefault();
    // Đầu tiên, xoá nó khỏi array trong state
    const newList = listFile.filter(item => item._id !== event.target.id);

    const actionRemoveFile = removeFile(newList);
    dispatch(actionRemoveFile);
    
    const fetchData = async () => {
        await FileApi.removeFile(event.target.id)
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
        <Banner title="Convert your video 🎉" backgroundUrl={Images.PINK_BG} message={message} />
        <div className="main-container-file">
            <form onSubmit={handleSubmit}>
                <div className="container-file">
                    <input type="file" onChange={handleChange}/>
                    <button type="submit">Convert File</button>
                </div>
            </form>

            <FileTable dataFile={listFile} handleRemove={handleRemove}/>
        </div>
        </>
    )
}

export default ConvertFile

