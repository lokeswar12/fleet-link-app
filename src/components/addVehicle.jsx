import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { apiCalls } from '../api/api';

function AddVehicle() {
    // 1. Updated state to include 'type' and a default 'status'
    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        tyres: '',
        type: '',
        status: 'active',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFeedback({ type: '', message: '' });

        try {
            // 3. Send the new fields to the API
            const apiObj = {
                url:"http://0.0.0.0:8080/api/vehicles",
                method:"POST",
                data:{
                    organisationId:"68cbdbc9c5d46bbe68405336",
                    vehicleName: formData.name,
                    type: formData.type,
                    vehicleCapacity: {
                        weight: Number(formData.capacity),
                        tyres: Number(formData.tyres),
                    },
                    vehicleStatus: formData.status,
                    availabilityStatus: "available",
                    vehicleStartTime: new Date()?.toISOString(),
                }
            }
            const response = await apiCalls(apiObj);

            setFeedback({ type: 'success', message: response.message });
            // Reset form to initial state
            setFormData({ name: '', capacity: '', tyres: '', type: '', status: 'active' });
        } catch (error) {
            const errorMessage = error.response?.error || 'An unexpected error occurred.';
            setFeedback({ type: 'error', message: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    mt: 4,
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Add New Vehicle
                </Typography>

                <TextField
                    label="Vehicle Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                />

                {/* 2. Added Dropdown for Vehicle Type */}
                <FormControl fullWidth required>
                    <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
                    <Select
                        labelId="vehicle-type-label"
                        id="vehicle-type-select"
                        name="type"
                        value={formData.type}
                        label="Vehicle Type"
                        onChange={handleChange}
                    >
                        <MenuItem value="truck">Truck</MenuItem>
                        <MenuItem value="bus">Bus</MenuItem>
                        <MenuItem value="van">Van</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Capacity (KG)"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Number of Tyres"
                    name="tyres"
                    type="number"
                    value={formData.tyres}
                    onChange={handleChange}
                    required
                    fullWidth
                />

                {/* 2. Added Dropdown for Status */}
                <FormControl fullWidth required>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status-select"
                        name="status"
                        value={formData.status}
                        label="Status"
                        onChange={handleChange}
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ position: 'relative', width: '100%' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Submit
                    </Button>
                    {isLoading && (
                        <CircularProgress
                            size={24}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-6px',
                                marginLeft: '-12px',
                            }}
                        />
                    )}
                </Box>

                {feedback.message && (
                    <Alert severity={feedback.type} sx={{ mt: 2, width: '100%' }}>
                        {feedback.message}
                    </Alert>
                )}
            </Box>
        </Container>
    );
}

export default AddVehicle;