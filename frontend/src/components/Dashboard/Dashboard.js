import React, { useState, useEffect } from 'react';
import {
    Container,
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    CircularProgress,
} from '@mui/material';
import PlantList from './PlantList';
import AddPlantPopup from '../Shared/AddPlantPopup';
import { getPlantTypes, getLocations, addPlantType, addLocation, addPlant, getPlants } from '../../services/plantsService';

function Dashboard() {
    const [popupOpen, setPopupOpen] = useState(false);
    const [plantTypes, setPlantTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [plants, setPlants] = useState([]); // Nuevo estado para las plantas
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddPlant = async (newPlant) => {
        try {
            const addPlantParam = {
                name: newPlant.name,
                plantTypeId: newPlant.plantTypeId,
                locationId: newPlant.locationId,
                wateringFrequencyDays: parseInt(newPlant.wateringFrequencyDays, 10),
                imageBase64: newPlant.image || null, // Optional image
            };
    
            await addPlant(addPlantParam);
    
            // Vuelve a cargar datos de plantas, tipos y locations
            fetchPlantData();
        } catch (err) {
            console.error('Error adding plant:', err.message);
        }
    };

    const handleAddPlantType = async (newPlantType) => {
        if (!newPlantType.trim()) {
            console.error('Invalid input: Plant type name is empty');
            return;
        }

        try {
            const formattedType =
                newPlantType.trim().charAt(0).toUpperCase() + newPlantType.trim().slice(1).toLowerCase();

            const response = await addPlantType({ name: formattedType });
            setPlantTypes((prevTypes) => [...prevTypes, response]);
        } catch (err) {
            console.error('Error adding plant type:', err);
            setError('Failed to add plant type. Please try again.');
        }
    };

    const handleAddLocation = async (newLocation) => {
        if (!newLocation.trim()) {
            console.error('Invalid input: Location name is empty');
            return;
        }

        try {
            const formattedLocation = {
                name: newLocation.trim().charAt(0).toUpperCase() + newLocation.trim().slice(1).toLowerCase(),
            };

            const response = await addLocation(formattedLocation);
            setLocations((prevLocations) => [...prevLocations, response]);
        } catch (err) {
            console.error('Error adding location:', err);
            setError('Failed to add location. Please try again.');
        }
    };

    const fetchPlantData = async () => {
        setLoading(true);
        try {
            // Se obtienen las plantas además de los tipos y ubicaciones
            const [types, locs, allPlants] = await Promise.all([
                getPlantTypes(),
                getLocations(),
                getPlants() // Asegúrate que esta función exista en tu servicio
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
                {error}
            </Typography>
        );
    }

    return (
        <Box>
            {/* Barra de navegación */}
            <AppBar position="static" sx={{ mb: 3 }}>
                <Toolbar>
                    <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
                        Plant Care Scheduler
                    </Typography>
                    <Button
                        color="inherit"
                        variant="outlined"
                        onClick={() => {
                            setError(null); // Limpiar cualquier error previo
                            setPopupOpen(true);
                        }}
                    >
                        Add Plant
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Contenido principal */}
            <Container>
                <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 'bold', mt: 2 }}
                >
                    Your Plants
                </Typography>

                {/* Pasamos la lista actualizada de plantas a PlantList */}
                <PlantList plants={plants} />

                {/* Popup para agregar nueva planta */}
                <AddPlantPopup
                    open={popupOpen}
                    onClose={() => {
                        setPopupOpen(false);
                        setError(null); // Limpiar cualquier error previo
                    }}
                    plantTypes={plantTypes}
                    locations={locations}
                    onAddPlant={handleAddPlant}
                    onAddPlantType={handleAddPlantType}
                    onAddLocation={handleAddLocation}
                />
            </Container>
        </Box>
    );
}

export default Dashboard;