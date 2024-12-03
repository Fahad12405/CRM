'use client';

import {
    Grid,
    Stack,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    CircularProgress,
    IconButton,
    useMediaQuery,
    useTheme,
    InputAdornment,
    TextField
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';
import Link from 'next/link';

interface SubAdmin {
    _id: string;
    name: string;
    email: string;
    phone: string;
    dob: string;
    cnic: string;
    salary: string;
}

function SubAdminPage() {
    const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchSubAdmins = async () => {
            setLoading(true);
            try {
                const adminLoginData: string | null = localStorage.getItem('AdminloginData');

                if (adminLoginData) {
                    const token = JSON.parse(adminLoginData).token;

                    const response = await axios.get(
                        'https://api-vehware-crm.vercel.app/api/credentials/admins',
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.status === 200) {
                        setSubAdmins(response.data.data.admins);
                    }
                } else {
                    setError('Admin login data is missing.');
                }
            } catch (err) {
                setError('Failed to fetch data.');
            }
            setLoading(false);
        };

        fetchSubAdmins();
    }, []);

    const handleDelete = async (id: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const adminLoginData: string | null = localStorage.getItem('AdminloginData');

                    if (adminLoginData) {
                        const token = JSON.parse(adminLoginData).token;

                        const response = await axios.delete(
                            `https://api-vehware-crm.vercel.app/api/auth/delete/${id}`,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (response.status === 200) {
                            setSubAdmins((prev) => prev.filter((subAdmin) => subAdmin._id !== id));
                            Swal.fire('Deleted!', 'The sub-admin has been deleted.', 'success');
                        }
                    }
                } catch (err) {
                    setError('Failed to delete the sub-admin.');
                    Swal.fire('Error!', 'There was an issue deleting the sub-admin.', 'error');
                }
                setLoading(false);
            }
        });
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const filteredSubAdmins = subAdmins.filter((subAdmin) =>
        subAdmin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center" sx={{ height: '96vh' }}>
                <CircularProgress />
            </Grid>
        );
    }

    if (error) {
        return (
            <Grid container justifyContent="center" alignItems="center" sx={{ height: '96vh' }}>
                <Typography color="error">{error}</Typography>
            </Grid>
        );
    }

    return (
        <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2, p: 2 }}>
                {/* Search Input */}
                <TextField
                    label="Search SubAdmins"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: '30%' }}  // Adjust width here, e.g., 50% or a specific pixel value
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>


            <TableContainer sx={{ overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            {!isSmallScreen && <TableCell>Contact</TableCell>}
                            {!isSmallScreen && <TableCell>Date of Birth</TableCell>}
                            <TableCell>CNIC</TableCell>
                            <TableCell>Salary</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSubAdmins
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((subAdmin) => (
                                <TableRow
                                    key={subAdmin._id}
                                    sx={{
                                        '&:hover': { backgroundColor: '#f5f5f5' },
                                    }}
                                >
                                    {/* Link only around the Name cell */}
                                    <TableCell>
                                        <Link
                                            href={`/dashboard/subadmin/${subAdmin._id}`}
                                            style={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                display: 'block', // Ensures only the Name cell is clickable
                                            }}
                                        >
                                            {subAdmin.name}
                                        </Link>
                                    </TableCell>

                                    <TableCell>{subAdmin.email}</TableCell>
                                    {!isSmallScreen && <TableCell>{subAdmin.phone}</TableCell>}
                                    {!isSmallScreen && <TableCell>{formatDate(subAdmin.dob)}</TableCell>}
                                    <TableCell>{subAdmin.cnic}</TableCell>
                                    <TableCell>{subAdmin.salary}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent navigation when clicking the delete button
                                                handleDelete(subAdmin._id);
                                            }}
                                            color="error"
                                            sx={{
                                                padding: isSmallScreen ? '4px' : '8px',
                                            }}
                                        >
                                            <DeleteIcon fontSize={isSmallScreen ? 'small' : 'medium'} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredSubAdmins.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Grid>
    );
}

export default SubAdminPage;
