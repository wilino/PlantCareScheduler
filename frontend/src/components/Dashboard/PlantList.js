import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Tooltip,
  Paper,
  InputAdornment,
  Stack
} from '@mui/material';
import { CleaningServices, Category, Opacity } from '@mui/icons-material';
import PlantCard from '../Shared/PlantCard';
import { getPlantWateringStatus } from '../../services/plantsService';

function PlantList({ plants = [] }) {
  const [plantsWithStatus, setPlantsWithStatus] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filteredPlants, setFilteredPlants] = useState([]);

  // Obtener el estado de riego para cada planta
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const updatedPlants = await Promise.all(
          plants.map(async (plant) => {
            const status = await getPlantWateringStatus(plant.id);
            return { ...plant, wateringStatus: status };
          })
        );
        setPlantsWithStatus(updatedPlants);
      } catch (err) {
        console.error('Error fetching watering statuses:', err);
      }
    };

    if (plants.length > 0) {
      fetchStatuses();
    } else {
      setPlantsWithStatus([]);
    }
  }, [plants]);

  // Filtrar plantas dinámicamente cuando cambian los filtros o la lista de plantas
  useEffect(() => {
    let filtered = plantsWithStatus;

    // Filtro por tipo de planta
    if (filterType) {
      filtered = filtered.filter((plant) => plant.plantTypeName === filterType);
    }

    // Filtro por estado de riego
    if (filterStatus) {
      filtered = filtered.filter((plant) => plant.wateringStatus === filterStatus);
    }

    // Filtro por ubicación
    if (filterLocation) {
      filtered = filtered.filter((plant) => plant.locationName === filterLocation);
    }

    setFilteredPlants(filtered);
  }, [filterType, filterStatus, filterLocation, plantsWithStatus]);

  // Limpiar filtros
  const clearFilters = () => {
    setFilterType('');
    setFilterStatus('');
    setFilterLocation('');
  };

  const plantTypes = [...new Set(plantsWithStatus.map((plant) => plant.plantTypeName))];
  const locations = [...new Set(plantsWithStatus.map((plant) => plant.locationName))];

  return (
    <Box sx={{ mt: 4 }}>
      {/* Panel de filtros */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Filter Your Plants
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            {/* Filtro por tipo de planta */}
            <FormControl fullWidth>
              <InputLabel>Plant Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Plant Type"
                startAdornment={
                  <InputAdornment position="start">
                    <Category color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Types</MenuItem>
                {plantTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {/* Filtro por estado de riego */}
            <FormControl fullWidth>
              <InputLabel>Watering Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Watering Status"
                startAdornment={
                  <InputAdornment position="start">
                    <Opacity color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
                <MenuItem value="Due Soon">Due Soon</MenuItem>
                <MenuItem value="OK">OK</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {/* Filtro por ubicación */}
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                label="Location"
              >
                <MenuItem value="">All Locations</MenuItem>
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {/* Botón para limpiar filtros */}
            <Tooltip title="Clear Filters">
              <Button
                variant="contained"
                color="secondary"
                onClick={clearFilters}
                sx={{
                  width: '100%',
                  fontWeight: 'bold',
                  boxShadow: 2,
                  ':hover': {
                    boxShadow: 4
                  }
                }}
              >
                <CleaningServices />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Mensaje si no hay resultados */}
      {filteredPlants.length === 0 ? (
        <Typography
          variant="h6"
          color="textSecondary"
          align="center"
          sx={{ mt: 4 }}
        >
          No plants match the selected filters.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {filteredPlants.map((plant) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={plant.id}>
              <PlantCard plant={plant} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default PlantList;