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
    tablePagination: {
        overflow:'visible'
    }
}));

export const FileTable = ({dataFile, handleRemove}) => {

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

    return (
        // <table>
        //     <thead>
        //         <tr>
        //             <th>ID</th>
        //             <th>Username</th>
        //             <th>File Upload</th>
        //             <th>File Converted</th>
        //             <th>Action</th>
        //         </tr>
        //     </thead>
        //     <tbody>
        //     {dataFile.map(oneVideo => 
        //         <tr key={oneVideo._id}>
        //             <td>{oneVideo._id}</td>
        //             <td>{oneVideo.username}</td>
        //             <td><a href={BASEURL + "/" + oneVideo._id + "/tai-file-upload"} target="_blank" rel="noopener noreferrer">{oneVideo.file_upload}</a></td>
        //             <td><a href={BASEURL + "/" + oneVideo._id + "/tai-file-convert"} target="_blank" rel="noopener noreferrer">{oneVideo.file_converted}</a></td>
        //             <td><button onClick={handleRemove} id={oneVideo._id} className="button-remove">Xoá</button></td>
        //         </tr>
        //     )}
        //     </tbody>
        // </table>
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
                <TableRow key={oneFile.name}>
                    <TableCell>
                        <Typography>{oneFile._id}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>{oneFile.username}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            <Link href={BASEURL + "/" + oneFile._id + "/tai-file-upload"} target="_blank" rel="noopener noreferrer">{oneFile.file_converted}</Link>
                            <Button color='primary'>Xem File Upload</Button>
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            <Link href={BASEURL + "/" + oneFile._id + "/tai-file-convert"} target="_blank" rel="noopener noreferrer">{oneFile.file_upload}</Link>
                            <Button color='primary'>Xem File Converted</Button>
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Grid contained>
                            <Grid item><Button color='primary' onClick={handleRemove} id={oneFile._id}>Xoá</Button></Grid>
                        </Grid>
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
            <TableFooter>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={dataFile.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                className={classes.tablePagination}
            />
            </TableFooter>
        </Table>
        </TableContainer>
    )
}
