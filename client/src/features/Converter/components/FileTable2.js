import { useState } from 'react';
// import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Typography,
    TablePagination,
    TableFooter,
    Button,
    Link,
} from '@mui/material';
<<<<<<< HEAD
=======
import { height } from '@mui/system';
>>>>>>> 718455087784e6d8fe07808111aab25d390aa418

const BASEURL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 650,
    },
    tableContainer: {
        borderRadius: 15,
        margin: '10px 10px',
        maxWidth: 950
    },
    tableHeaderCell: {
        fontWeight: 'bold',
    },
<<<<<<< HEAD
}));

export const FileTable = ({dataFile, handleRemove}) => {
=======
    button: {
        width: "20px",
        height: "10px"
    }
}));

export const FileTable = ({dataFile, handleRemove, setVideoView}) => {
>>>>>>> 718455087784e6d8fe07808111aab25d390aa418

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

<<<<<<< HEAD
=======
    const handleChangeVideoView = (video) => {
        setVideoView(video);
        console.log(video);
    }
>>>>>>> 718455087784e6d8fe07808111aab25d390aa418
    return (
        <TableContainer component={Paper} elevation={10} className={classes.tableContainer} color="secondary">
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell className={classes.tableHeaderCell}>ID</TableCell>
                <TableCell className={classes.tableHeaderCell}>Username</TableCell>
                <TableCell className={classes.tableHeaderCell}>File Upload</TableCell>
                <TableCell className={classes.tableHeaderCell}>File Converted</TableCell>
                <TableCell className={classes.tableHeaderCell}>Action</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {dataFile.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((oneFile) => (
                <TableRow key={oneFile._id}>
                    <TableCell>
                        <Typography>{oneFile._id}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>{oneFile.username}</Typography>
                    </TableCell>
                    <TableCell>
<<<<<<< HEAD
=======
<<<<<<<< HEAD:client/src/features/Converter/components/FileTable2.js
                        <Typography>
                            <Link href={BASEURL + "/" + oneFile._id + "/tai-file-upload"} target="_blank" rel="noopener noreferrer">{oneFile.file_upload}</Link>
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            <Link href={BASEURL + "/" + oneFile._id + "/tai-file-convert"} target="_blank" rel="noopener noreferrer">{oneFile.file_converted}</Link>                                    
                        </Typography>
========
>>>>>>> 718455087784e6d8fe07808111aab25d390aa418
                        <Grid container>
                            <Grid item>
                                <Link href={BASEURL + "/" + oneFile._id + "/tai-file-upload"} target="_blank" rel="noopener noreferrer">{oneFile.filename}</Link>
                            </Grid>
<<<<<<< HEAD
=======
                            <Grid item style={{display: "inline-flex", flexWrap: "nowrap", alignItems: "center", height:"20px"}}>
                                <Button variant="outlined" style={{height:"20px"}} color="error" onClick={() => handleChangeVideoView(BASEURL + "/upload/" + oneFile.username + "/" + oneFile.filename + "/" + oneFile.filename + "." + ((oneFile.formatInput == "hls") ? "m3u8" : ((oneFile.formatInput == "dash") ? "mpd" : oneFile.formatInput)))}>Xem thử</Button>
                                <Button variant="contained" color="success" style={{height:"20px"}}>{oneFile.formatInput}</Button>
                            </Grid>
>>>>>>> 718455087784e6d8fe07808111aab25d390aa418
                        </Grid>
                    </TableCell>
                    <TableCell>
                        <Grid container>
                            <Grid item>
                                <Link href={BASEURL + "/" + oneFile._id + "/tai-file-convert"} target="_blank" rel="noopener noreferrer">{oneFile.filename}</Link>
                            </Grid>
<<<<<<< HEAD
                        </Grid>
=======
                            <Grid item style={{display: "inline-flex", flexWrap: "nowrap", alignItems: "center", height:"20px"}}>
                                <Button variant="outlined" style={{height:"20px"}} color="error" onClick={() => handleChangeVideoView(BASEURL + "/upload/" + oneFile.username + "/" + oneFile.filename + "/Master." + ((oneFile.formatOutput == "hls") ? "m3u8" : ((oneFile.formatOutput == "dash") ? "mpd" : oneFile.formatOutput)))}>Xem thử</Button>
                                <Button variant="contained" color="success" style={{height:"20px"}}>{oneFile.formatOutput}</Button>
                            </Grid>
                        </Grid>
>>>>>>>> 718455087784e6d8fe07808111aab25d390aa418:client/src/features/Converter/components/FileTable.js
>>>>>>> 718455087784e6d8fe07808111aab25d390aa418
                    </TableCell>
                    <TableCell>
                        <Grid container>
                            <Grid item><Button color='primary' onClick={handleRemove} id={oneFile._id}>Xoá</Button></Grid>
                        </Grid>
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        count={dataFile.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />  
                </TableRow>
            </TableFooter>
        </Table>
        </TableContainer>
    )
}
