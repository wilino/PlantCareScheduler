import React, { useState, useEffect } from 'react';
import {
    Container,
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    CircularProgress,
    Divider,
    Stack
} from '@mui/material';
import { AddCircleOutline, Spa } from '@mui/icons-material';
import PlantList from './PlantList';
import AddPlantPopup from '../Shared/AddPlantPopup';
import Footer from '../Shared/Footer';
import WeeklyStatsCard from '../Shared/WeeklyStatsCard'; // Import del nuevo componente
import { getPlantTypes, getLocations, addPlantType, addLocation, addPlant, getPlants } from '../../services/plantsService';

function Dashboard() {
    const [popupOpen, setPopupOpen] = useState(false);
    const [plantTypes, setPlantTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddPlant = async (newPlant) => {
        try {
            const addPlantParam = {
                name: newPlant.name,
                plantTypeId: newPlant.plantTypeId,
                locationId: newPlant.locationId,
                wateringFrequencyDays: parseInt(newPlant.wateringFrequencyDays, 10),
                imageBase64: newPlant.image || null,
            };
    
            await addPlant(addPlantParam);
            await fetchPlantData();
        } catch (err) {
            console.error('Error adding plant:', err.message);
            throw err;
        }
    };

    const handleAddPlantType = async (newPlantType) => {
        if (!newPlantType.trim()) {
            console.error('Invalid input: Plant type name is empty');
            throw new Error('Invalid input: Plant type name is empty');
        }

        const formattedType =
            newPlantType.trim().charAt(0).toUpperCase() + newPlantType.trim().slice(1).toLowerCase();

        try {
            const response = await addPlantType({ name: formattedType });
            setPlantTypes((prevTypes) => [...prevTypes, response]);
            return response;
        } catch (err) {
            console.error('Error adding plant type:', err);
            setError('Failed to add plant type. Please try again.');
            throw err;
        }
    };

    const handleAddLocation = async (newLocation) => {
        if (!newLocation.trim()) {
            console.error('Invalid input: Location name is empty');
            throw new Error('Invalid input: Location name is empty');
        }

        const formattedLocation = {
            name: newLocation.trim().charAt(0).toUpperCase() + newLocation.trim().slice(1).toLowerCase(),
        };

        try {
            const response = await addLocation(formattedLocation);
            setLocations((prevLocations) => [...prevLocations, response]);
            return response;
        } catch (err) {
            console.error('Error adding location:', err);
            setError('Failed to add location. Please try again.');
            throw err;
        }
    };

    const fetchPlantData = async () => {
        setLoading(true);
        try {
            const [types, locs, allPlants] = await Promise.all([
                getPlantTypes(),
                getLocations(),
                getPlants()
            ]);

            setPlantTypes(types);
            setLocations(locs);
            setPlants(allPlants);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load plant data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlantData();
    }, []);

    if (loading) {
        return (
            <Box 
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: 'linear-gradient(to right, #a8e063, #56ab2f)'
                }}
            >
                <CircularProgress sx={{ color: '#fff' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box 
                sx={{
                    height: '100vh',
                    background: 'linear-gradient(to right, #a8e063, #56ab2f)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Typography variant="h6" color="error" align="center">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(to right, #a8e063, #56ab2f)',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <AppBar position="static" sx={{ mb: 3, backgroundColor: '#2e7d32' }}>
                <Toolbar>
                    <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Plant Care Scheduler
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddCircleOutline />}
                        onClick={() => {
                            setError(null);
                            setPopupOpen(true);
                        }}
                        sx={{
                            fontWeight: 'bold',
                            boxShadow: 2,
                            ':hover': {
                                boxShadow: 4
                            }
                        }}
                    >
                        Add Plant
                    </Button>
                </Toolbar>
            </AppBar>

            <Container sx={{ backgroundColor: '#fff', borderRadius: 2, py: 4, boxShadow: 3, flexGrow: 1 }}>
                <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Spa color="primary" />
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{ fontWeight: 'bold' }}
                        >
                            Your Plants
                        </Typography>
                    </Box>
                    <Divider />
                </Stack>

                <PlantList plants={plants} />

                {/* Tarjeta de estadísticas semanales */}
                <WeeklyStatsCard />

                <AddPlantPopup
                    open={popupOpen}
                    onClose={() => {
                        setPopupOpen(false);
                        setError(null);
                    }}
                    plantTypes={plantTypes}
                    locations={locations}
                    onAddPlant={handleAddPlant}
                    onAddPlantType={handleAddPlantType}
                    onAddLocation={handleAddLocation}
                />
            </Container>

            <Footer />
        </Box>
    );
}

export default Dashboard;