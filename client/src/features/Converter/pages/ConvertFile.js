import FileApi from 'API/fileApi';
import Banner from 'components/Banner';
import Images from 'constants/images';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'reactstrap';
import { removeFile, saveFile } from './../../../actions/file';
import { FileTable } from './../components/FileTable';
import "./style.css";
import VideoDisplay from './../components/VideoDisplay';
import {Paper, Grid, Typography, Input, Button} from "@mui/material";

function ConvertFile(props) {
    const listFile = useSelector(state => state.file.listFile);
    const dispatch = useDispatch();

    const [video, setVideo] = useState({data: null, status: 0}); // status: 0: Chưa có file upload, 1: Đã có file upload, chưa convert, 2: Đã convert hoàn thành
    const [message, setMessage] = useState(null);
    const [changeData, setChangeData] = useState(0);
    const [outputOption, setOutputOption] = useState({videoCodec: "h264", videoFormat: "hls"});

    const flexStyle = {display: 'flex', flexDirection: 'column', alignItems: 'center'}
    const flexStyle2 = {display: 'flex', flexDirection: 'row', alignItems: 'center'}
    const flexStyle2Item = {marginRight: "20px"}

    const styleHeader = {marginBottom: '30px'}

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
   }, [changeData, dispatch]);


   const handleSubmit = (event) => {
    event.preventDefault();
    if(video.status === 0) setMessage("Bạn phải chọn video muốn convert!");
    else {
        const formData = new FormData();
        formData.append("video", video.data);
        formData.append("outputOption", outputOption);

        const fetchData = async () => {
            setMessage("Đang convert... Vui lòng chờ!");
            FileApi.uploadFile(formData)
            .then((response) => {
                setMessage(response.message);
                if(response.status === 1) {
                    setChangeData(changeData + 1);
                    setVideo({...video, status: 2});
                }
            })
            .catch(err => console.log(err));
        }

        fetchData();
    }
    
  }

  const handleChangeVideoInput = (event) => {
    const file = event.target.files[0];
    setVideo({data: file, status: 1});
  }
  
  const handleChangeOptionVideoOutput = (event) => {
    setOutputOption({...outputOption, [event.target.name]:event.target.value});
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
        <Grid contained style={flexStyle}>
            <Grid contained style={flexStyle2} elevation={10}>
                <Grid item style={flexStyle2Item}>
                    <Input type="file" color="primary" onChange={handleChangeVideoInput}></Input>
                </Grid>
                <Grid item style={flexStyle2Item}>
                    <Typography>Chọn định dạng</Typography>
                    <select onChange={handleChangeOptionVideoOutput} name="videoFormat" value={outputOption.videoFormat}>
                        <option value="hls">HLS</option>
                        <option value="dash">DASH</option>
                    </select>
                </Grid>
                <Grid item style={flexStyle2Item}>
                    <Typography>Chọn video codec</Typography>
                    <select onChange={handleChangeOptionVideoOutput} name="videoCodec" value={outputOption.videoCodec}>
                        <option value="h264">H.264</option>
                        <option value="vp9">VP9</option>
                    </select>
                </Grid>
                
                <Grid item style={flexStyle2Item}>
                    <Button type='submit' variant="contained" onClick={handleSubmit} color='primary'>Convert</Button>       
                </Grid>
            </Grid>
            <Grid item style={styleHeader}><FileTable dataFile={listFile} handleRemove={handleRemove}/></Grid>
        </Grid>
        {/* <div className="main-container-convert-file">
            <div className="form-upload-file">
                <form onSubmit={handleSubmit}>
                    <div className="container-file">
                        <input type="file" onChange={handleChangeVideo}/>
                        <button type="submit">Convert File</button>
                    </div>
                </form>
            </div>
            {(video.status === 2) 
                ? 
                <div className="video-preview">
                    <VideoDisplay video={outputVideo}/>
                </div>
                : <div></div>
            }
            <div className="list-file">
                <FileTable dataFile={listFile} handleRemove={handleRemove}/>
            </div>
        </div> */}
        </>
    )
}

export default ConvertFile

