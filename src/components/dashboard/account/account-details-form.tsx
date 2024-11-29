'use client';

import * as React from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { blue } from '@mui/material/colors';


const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },

];

export function AccountDetailsForm(): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    name: '',
    contact: '',
    cnic: '',
    dob: '',
    gender: '',
    salary: '',
  });

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // Fetch initial user data from localStorage
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('AdminloginData');
      if (storedData) {
        const userData = JSON.parse(storedData);
        setFormData({
          name: userData.name || '',
          contact: userData.phone || '',
          cnic: userData.cnic || '',
          dob: userData.dob || '',
          gender: userData.gender || '',
          salary: userData.salary || '',
        });
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { value: unknown }>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const adminLoginData: string | null = localStorage.getItem('AdminloginData');
      const response = await fetch('https://api-vehware-crm.vercel.app/api/auth/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(adminLoginData!).token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        // Success Alert
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile updated successfully!',
          confirmButtonColor: '#3085d6',
        });

        // Update localStorage with new data
        if (typeof window !== 'undefined') {
          const updatedData = {
            ...JSON.parse(localStorage.getItem('AdminloginData') || '{}'),
            ...formData,
          };
          localStorage.setItem('AdminloginData', JSON.stringify(updatedData));
        }
      } else {
        // Error Alert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Failed to update profile.',
          confirmButtonColor: '#d33',
        });
      }
    } catch (error) {
      // Network/Error Alert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <Card
        sx={{
          maxWidth: 800,
          mx: 'auto',
          mt: 1, // Reduced top margin further to bring the form higher
          p: 4, // Increased padding for more space around the content
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'white',
        }}
      >
        <CardHeader
          subheader="Update your profile information"
          title="Profile"
          sx={{
            textAlign: 'center',
            color: blue[800], // Applying a blue color (blue[800])
            fontSize: '4rem', // Try using 4rem for the font size (this is a large size)
            fontWeight: 'bold', // Optional: Make it bold to make it stand out more
          }}
        />
        <Divider sx={{ mb: 6 }} />
        <CardContent>
          <Grid container spacing={3}>
            {/* Full Name */}
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Full Name</InputLabel>
                <OutlinedInput
                  value={formData.name}
                  onChange={handleChange}
                  label="Full Name"
                  name="name"
                />
              </FormControl>
            </Grid>
            {/* Contact */}
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Contact</InputLabel>
                <OutlinedInput
                  value={formData.contact}
                  onChange={handleChange}
                  label="Contact"
                  name="contact"
                  type="tel"
                />
              </FormControl>
            </Grid>
            {/* CNIC */}
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>CNIC</InputLabel>
                <OutlinedInput
                  value={formData.cnic}
                  onChange={handleChange}
                  label="CNIC"
                  name="cnic"
                />
              </FormControl>
            </Grid>
            {/* Date of Birth */}
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Date of Birth</InputLabel>
                <OutlinedInput
                  value={formData.dob}
                  onChange={handleChange}
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  inputProps={{
                    style: {
                      padding: '10px 14px', // Adjust padding for Date Input
                    },
                  }}
                />
              </FormControl>
            </Grid>
            {/* Gender */}
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender"
                  name="gender"
                >
                  {genders.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Salary */}
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Salary</InputLabel>
                <OutlinedInput
                  value={formData.salary}
                  onChange={handleChange}
                  label="Salary"
                  name="salary"
                  type="number"
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ mt: 3, mb: 2 }} />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading} // Apply the disabled prop here, not inside sx
            sx={{
              bgcolor: blue[600], // Applying blue[600] color
              color: 'common.white', // Ensuring the text is white for better contrast
              px: 4,
              py: 1,
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': {
                bgcolor: blue[800], // Darker blue on hover
              },
            }}
          >
            {loading ? 'Saving...' : 'Save Details'}
          </Button>
        </CardActions>
      </Card>
    </form>

  );
}
