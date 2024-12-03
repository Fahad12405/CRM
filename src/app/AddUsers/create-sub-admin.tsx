'use client'

import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText, Grid, Container, Typography , IconButton, InputAdornment } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Visibility, VisibilityOff } from '@mui/icons-material';


interface FormData {
    name: string;
    email: string;
    password: string;
    gender: string;
    cnic: number;
    phone: number;
    salary: number;
    dob: string;  
    addedBy: string;
    type: string;
}

const UserForm: React.FC = () => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        mode: 'onBlur',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = (data: FormData) => {
        console.log(data); 
    
        const adminLoginData: string | null = localStorage.getItem('AdminloginData');
    
        data.type = "sub-admin";
    
        axios.post('https://api-vehware-crm.vercel.app/api/auth/signup', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(adminLoginData!).token}`,
            },
        })
        .then((res) => {
            console.log(res.data);
            Swal.fire({
                title: "Success",
                text: "Sub-Admin added successfully",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
             
                reset();
            });
        })
        .catch((e) => {
            console.log(e);
            Swal.fire({
                title: "Error",
                text: e.response?.data?.error || "An error occurred",
                icon: "error",
                confirmButtonText: "OK",
            }).then(() => {
                
                reset();
            });
        });
    };
    

    return (
        <Container maxWidth="sm" sx={{ mt: { xs: 4, sm: 8 } }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.8rem', sm: '3rem' },
                    textAlign: 'center',
                    letterSpacing: '0.5px',
                    lineHeight: 1.2,
                    paddingBottom: 2,
                    mb: 3,
                }}
            >
                Add Sub-Admin
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: 'Name is required',
                                minLength: { value: 3, message: 'Name must be at least 3 characters' },
                                maxLength: { value: 20, message: 'Name must be at most 20 characters' },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Name"
                                    fullWidth
                                    variant="outlined"
                                    error={Boolean(errors.name)}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: 'Invalid email address',
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    fullWidth
                                    variant="outlined"
                                    error={Boolean(errors.email)}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters long",
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                    message:
                                        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                                },
                            }}
                            render={({ field }) => {
                                const [showPassword, setShowPassword] = React.useState(false);

                                const handleTogglePassword = () => { setShowPassword((prev) => !prev); };

                                return (
                                    <TextField
                                        {...field}
                                        label="Password"
                                        fullWidth
                                        variant="outlined"
                                        type={showPassword ? "text" : "password"} 
                                        error={Boolean(errors.password)}
                                        helperText={errors.password?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleTogglePassword} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                );
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="gender"
                            control={control}
                            rules={{ required: 'Gender is required' }}
                            render={({ field }) => (
                                <FormControl fullWidth error={Boolean(errors.gender)}>
                                    <InputLabel>Gender</InputLabel>
                                    <Select {...field} label="Gender">
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="custom">Custom</MenuItem>
                                    </Select>
                                    {errors.gender ? <FormHelperText>{errors.gender?.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="cnic"
                            control={control}
                            rules={{
                                required: 'CNIC is required',
                                minLength: { value: 13, message: 'CNIC must be at least 13 digits' },
                                maxLength: { value: 13, message: 'CNIC must be at most 13 digits' },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="CNIC"
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    error={Boolean(errors.cnic)}
                                    helperText={errors.cnic?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                required: 'Phone number is required',
                                minLength: { value: 10, message: 'Phone number must be at least 10 digits' },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone"
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    error={Boolean(errors.phone)}
                                    helperText={errors.phone?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="salary"
                            control={control}
                            rules={{ required: 'Salary is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Salary"
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    error={Boolean(errors.salary)}
                                    helperText={errors.salary?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="dob"
                            control={control}
                            rules={{ required: 'Date of Birth is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Date of Birth"
                                    fullWidth
                                    variant="outlined"
                                    type="date"
                                    error={Boolean(errors.dob)}
                                    helperText={errors.dob?.message}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="type"
                            control={control}
                            defaultValue="sub-admin" // Default value set to "sub-admin"
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select {...field} label="Type" disabled> {/* Dropdown disabled */}
                                        <MenuItem value="sub-admin">Sub Admin</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default UserForm;
