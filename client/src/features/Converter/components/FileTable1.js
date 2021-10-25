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
      width:'100%'
    },
    tableContainer: {
        borderRadius: 15,
        margin: '10px 10px',
        width:'100%',
        overflow:'visible'
    },
    tableHeaderCell: {
        fontWeight: 'bold',
    },
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
        <TableContainer component={Paper} elevation={10} className={classes.tableContainer} color="secondary">
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell className={classes.tableHeaderCell}>File Upload</TableCell>
                <TableCell className={classes.tableHeaderCell}>File Converted</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {dataFile.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((oneFile) => (
                <TableRow key={oneFile._id}>
                    <TableCell>
                        <Typography>
                            <Grid container>
                                <Grid item>
                                    <Link href={BASEURL + "/" + oneFile._id + "/tai-file-upload"} target="_blank" rel="noopener noreferrer">{oneFile.file_upload}</Link>
                                </Grid>
                                <Grid item style={{color: "secondary"}}>
                                    <Button color='primary'>Xem thử</Button>
                                </Grid>
                            </Grid>
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>
                            <Grid container>
                                <Grid item>
                                    <Link href={BASEURL + "/" + oneFile._id + "/tai-file-convert"} target="_blank" rel="noopener noreferrer">{oneFile.file_converted}</Link>                                    
                                </Grid>
                                <Grid item>
                                    <Button color='primary'>Xem thử</Button>
                                </Grid>
                            </Grid>
                        </Typography>
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
