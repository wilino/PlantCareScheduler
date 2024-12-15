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
  CircularProgress,
} from '@mui/material';
import { CleaningServices } from '@mui/icons-material';
import PlantCard from '../Shared/PlantCard';
import { getPlantWateringStatus } from '../../services/plantsService';

function PlantList({ plants = [] }) {
  const [plantsWithStatus, setPlantsWithStatus] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filteredPlants, setFilteredPlants] = useState([]);

  // Obtener el estado de riego para cada planta
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const updatedPlants = await Promise.all(
          plants.map(async (plant) => {
            const status = await getPlantWateringStatus(plant.id);
            return { ...plant, wateringStatus: status }; // Agregar wateringStatus a cada planta
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

    setFilteredPlants(filtered);
  }, [filterType, filterStatus, plantsWithStatus]);

  // Limpiar filtros
  const clearFilters = () => {
    setFilterType('');
    setFilterStatus('');
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Filtros */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        {/* Filtro por tipo de planta */}
        <FormControl sx={{ width: '45%' }}>
          <InputLabel>Plant Type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Plant Type"
          >
            <MenuItem value="">All Types</MenuItem>
            {[...new Set(plantsWithStatus.map((plant) => plant.plantTypeName))].map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro por estado de riego */}
        <FormControl sx={{ width: '45%' }}>
          <InputLabel>Watering Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Watering Status"
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
            <MenuItem value="Due Soon">Due Soon</MenuItem>
            <MenuItem value="OK">OK</MenuItem>
          </Select>
        </FormControl>

        {/* Botón para limpiar filtros */}
        <Tooltip title="Clear Filters">
          <Button
            variant="outlined"
            color="primary"
            onClick={clearFilters}
            sx={{ minWidth: 'auto', ml: 2 }}
          >
            <CleaningServices />
          </Button>
        </Tooltip>
      </Box>

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
        // Plantas filtradas
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