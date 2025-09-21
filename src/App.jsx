import React from 'react';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import AddVehicle from './components/addVehicle.jsx';
import SearchAndBook from './components/searchAndBook.jsx';

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            B2B Vehicle Management
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Search & Book
          </Button>
          <Button color="inherit" component={RouterLink} to="/add-vehicle">
            Add Vehicle
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<SearchAndBook />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;