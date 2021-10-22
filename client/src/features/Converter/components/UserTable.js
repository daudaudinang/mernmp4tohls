import { useState } from 'react';
import { Link } from 'react-router-dom';
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
    Button
 } from '@mui/material';

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
}));

export const UserTable = ({dataUser, handleEdit, handleRemove}) => {
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
        <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell className={classes.tableHeaderCell}>ID</TableCell>
                <TableCell className={classes.tableHeaderCell}>Account Type</TableCell>
                <TableCell className={classes.tableHeaderCell}>Username</TableCell>
                <TableCell className={classes.tableHeaderCell}>Password</TableCell>
                <TableCell className={classes.tableHeaderCell}>Action</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {dataUser.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((oneUser) => (
                <TableRow key={oneUser.name}>
                    <TableCell>
                        {/* <Grid item lg={2}>
                            <Avatar alt={row.name} src='.' className={classes.avatar}/>
                        </Grid>
                        <Grid item lg={10}>
                            <Typography className={classes.name}>{row.name}</Typography>
                            <Typography color="textSecondary" variant="body2">{row.email}</Typography>
                            <Typography color="textSecondary" variant="body2">{row.phone}</Typography>
                        </Grid> */}
                        <Typography>{oneUser._id}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>{oneUser.account_type}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>{oneUser.username}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography>{oneUser.password}</Typography>
                    </TableCell>
                    <TableCell>
                        <Grid contained>
                            <Grid item><Button color='primary' onClick={handleEdit}><Link to={{pathname:`/UserController/edit/${oneUser._id}`}}> Sửa </Link></Button></Grid>
                            <Grid item><Button color='primary' onClick={handleRemove} id={oneUser._id}>Xoá</Button></Grid>
                        </Grid>
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
            <TableFooter>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={dataUser.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            </TableFooter>
        </Table>
        </TableContainer>
    )
}
