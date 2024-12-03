'use client';

import React, { useRef, useState, ChangeEvent, useContext } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { AppContext } from '@/contexts/isLogin';
import Swal from 'sweetalert2';

interface Employee {
    name: string;
    email: string;
    phone: number;
    cnic: number;
    gender: string;
    salary: number;
    type: string;
    dob: string;
    password: string
}

const EmployeeExcel: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [employeeData, setEmployeeData] = useState<Employee[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { storedValue } = useContext(AppContext)!;

    // Function to handle Excel file upload
    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData: Employee[] = XLSX.utils.sheet_to_json(sheet);
            setEmployeeData(parsedData);
            setOpen(true); // Open modal to show data

            // Clear the file input value
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };

        reader.readAsArrayBuffer(file);
    };

    // Function to handle modal close
    const handleClose = () => {
        setOpen(false);
    };

    // Function to handle "Send" button click
    const handleSend = async () => {
        const res = axios.post('https://api-vehware-crm.vercel.app/api/auth/signup', employeeData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedValue.token}`,
            },
        }).then((res) => {
            console.log(res.data)
            Swal.fire({
                title: "Success",
                text: "Employee added successfully",
                icon: "success",
                confirmButtonText: "OK",
            });
        }).catch((e) => {
            console.log(e.response.data)
            Swal.fire({
                title: "Error",
                text: e.response.data.error,
                icon: "error",
                confirmButtonText: "OK",
            })
        })
        console.log('Uploaded Employee Data:', employeeData);
        setOpen(false); // Close modal after sending
    };

    console.log("employeeData--->", employeeData)

    return (
        <div>
            <Button variant="contained" component="label" sx={{ mb: 2 }}>
                Upload Excel File
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    hidden
                    onChange={handleFileUpload}
                    ref={fileInputRef} // Attach the file input ref
                />
            </Button>

            {/* Modal to preview uploaded data */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Uploaded Employee Details</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>CNIC</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>Salary</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Date of Birth</TableCell>
                                    <TableCell>Password</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employeeData.map((employee, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{employee.name}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>{employee.phone}</TableCell>
                                        <TableCell>{employee.cnic}</TableCell>
                                        <TableCell>{employee.gender}</TableCell>
                                        <TableCell>{employee.salary}</TableCell>
                                        <TableCell>{employee.type}</TableCell>
                                        <TableCell>{new Date(employee.dob).toLocaleDateString()}</TableCell>
                                        <TableCell>{employee.password}</TableCell>
                                    </TableRow> 
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSend}>Send</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EmployeeExcel;
