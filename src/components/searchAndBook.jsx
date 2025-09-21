import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider,
    Paper,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { apiCalls } from '../api/api';

function SearchAndBook() {
    const [searchParams, setSearchParams] = useState({
        capacityRequired: '',
        fromPincode: '',
        toPincode: '',
        startTime: dayjs(),
    });
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchFeedback, setSearchFeedback] = useState({ type: '', message: '' });

    // State to track booking status for each vehicle individually
    const [bookingStatus, setBookingStatus] = useState({});

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (newValue) => {
        setSearchParams((prev) => ({ ...prev, startTime: newValue }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsSearching(true);
        setSearchResults([]);
        setSearchFeedback({ type: '', message: '' });
        setBookingStatus({});

        try {
            const apiObj = {
                url:"http://0.0.0.0:8080/api/vehicles/available",
                method:"GET",
                params: {
                    ...searchParams,
                    startTime: searchParams.startTime.toISOString(),
                }
            }
            const response = await apiCalls(apiObj)
            setSearchResults(response.data);
            if (response.data.length === 0) {
                setSearchFeedback({ type: 'info', message: 'No vehicles found for the given criteria.' });
            }
        } catch (error) {
            setSearchFeedback({ type: 'error', message: 'Failed to fetch available vehicles.' });
        } finally {
            setIsSearching(false);
        }
    };

    const handleBookNow = async (vehicleId) => {
        setBookingStatus(prev => ({ ...prev, [vehicleId]: { loading: true, message: '', type: '' } }));

        const bookingData = {
            vehicleId,
            fromPincode: searchParams.fromPincode,
            toPincode: searchParams.toPincode,
            startTime: searchParams.startTime.toISOString(),
            organisationId: '68cbdbc9c5d46bbe68405336' // Hardcoded as per requirements
        };

        try {
            const response = await api.post('/api/bookings', bookingData);
            setBookingStatus(prev => ({ ...prev, [vehicleId]: { loading: false, message: response.data.message, type: 'success' } }));
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Booking failed.';
            setBookingStatus(prev => ({ ...prev, [vehicleId]: { loading: false, message: errorMessage, type: 'error' } }));
        }
    };

    return (
        <Container maxWidth="md">
            {/* Search Form */}
            <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Search & Book a Vehicle
                </Typography>
                <TextField label="Capacity Required (KG)" name="capacityRequired" type="number" value={searchParams.capacityRequired} onChange={handleSearchChange} required fullWidth />
                <TextField label="From Pincode" name="fromPincode" type="number" value={searchParams.fromPincode} onChange={handleSearchChange} required fullWidth />
                <TextField label="To Pincode" name="toPincode" type="number" value={searchParams.toPincode} onChange={handleSearchChange} required fullWidth />
                <DateTimePicker label="Start Date & Time" value={searchParams.startTime} onChange={handleDateChange} />
                <Button type="submit" variant="contained" disabled={isSearching} sx={{ mt: 1 }}>
                    {isSearching ? <CircularProgress size={24} /> : 'Search Availability'}
                </Button>
            </Box>

            {/* Results Section */}
            <Box sx={{ mt: 4 }}>
                {searchFeedback.message && <Alert severity={searchFeedback.type}>{searchFeedback.message}</Alert>}

                {searchResults.length > 0 && (
                    <Paper elevation={2}>
                        <List>
                            {searchResults.map((vehicle, index) => (
                                <React.Fragment key={vehicle.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={`${vehicle.name} - ${vehicle.capacity} KG`}
                                            secondary={`Tyres: ${vehicle.tyres} | Estimated Duration: ${vehicle.estimatedRideDuration}`}
                                        />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleBookNow(vehicle.id)}
                                                disabled={bookingStatus[vehicle.id]?.loading || bookingStatus[vehicle.id]?.type === 'success'}
                                            >
                                                {bookingStatus[vehicle.id]?.loading ? <CircularProgress size={20} /> : 'Book Now'}
                                            </Button>
                                            {bookingStatus[vehicle.id]?.message && (
                                                <Alert severity={bookingStatus[vehicle.id]?.type} sx={{ py: 0, px: 1 }}>
                                                    {bookingStatus[vehicle.id]?.message}
                                                </Alert>
                                            )}
                                        </Box>
                                    </ListItem>
                                    {index < searchResults.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>
        </Container>
    );
}

export default SearchAndBook;