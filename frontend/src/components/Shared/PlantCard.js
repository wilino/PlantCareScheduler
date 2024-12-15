import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { WaterDrop, Schedule, Place, Opacity, History } from '@mui/icons-material'; // Íconos
import { waterPlant, getPlantById, getPlantCareHistory } from '../../services/plantsService';
import PlantStatus from './PlantStatus';
import PlantHistoryPopup from './PlantHistoryPopup';

function PlantCard({ plant: initialPlant }) {
  const [plant, setPlant] = useState(initialPlant);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [refreshStatus, setRefreshStatus] = useState(false);
  const [historyPopupOpen, setHistoryPopupOpen] = useState(false);
  const [careHistory, setCareHistory] = useState([]);

  const calculateTimeRemaining = () => {
    const lastWateredDate = new Date(plant.lastWateredDate);
    const nextWateringDate = new Date(lastWateredDate.getTime() + plant.wateringFrequencyDays * 24 * 60 * 60 * 1000);
    const now = new Date();

    const timeDiff = nextWateringDate - now;
    if (timeDiff <= 0) {
      setIsOverdue(true);
      setTimeRemaining('WATER NOW');
      return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    setIsOverdue(false);
  };

  const handleWaterPlant = async () => {
    try {
      await waterPlant(plant.id);
      const updatedPlant = await getPlantById(plant.id);
      setPlant(updatedPlant);
      setSnackbarMessage(`Plant "${plant.name}" watered successfully!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Refrescar el componente PlantStatus
      setRefreshStatus((prev) => !prev);
    } catch (err) {
      setSnackbarMessage(`Failed to water plant: ${err.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const fetchCareHistory = async () => {
    try {
      const history = await getPlantCareHistory(plant.id);
      setCareHistory(history);
      setHistoryPopupOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to fetch care history');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [plant.lastWateredDate, plant.wateringFrequencyDays]);

  return (
    <>
      <Card sx={{ maxWidth: 345, margin: '0 auto', boxShadow: 3 }}>
        {plant.imageBase64 && (
          <CardMedia
            component="img"
            height="180"
            image={plant.imageBase64}
            alt={plant.name}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {plant.name}
          </Typography>

          {/* Tipo de planta */}
          <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
            <Opacity color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">
              <strong>Type:</strong> {plant.plantTypeName}
            </Typography>
          </Box>

          {/* Ubicación */}
          <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
            <Place color="secondary" sx={{ mr: 1 }} />
            <Typography variant="body2">
              <strong>Location:</strong> {plant.locationName}
            </Typography>
          </Box>

          {/* Último riego */}
          <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
            <WaterDrop color="info" sx={{ mr: 1 }} />
            <Typography variant="body2">
              <strong>Last Watered:</strong> {new Date(plant.lastWateredDate).toLocaleDateString()}
            </Typography>
          </Box>

          {/* Frecuencia de riego */}
          <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
            <Schedule color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">
              <strong>Water Every:</strong> {plant.wateringFrequencyDays} days
            </Typography>
          </Box>

          {/* Tiempo restante o "WATER NOW" */}
          {isOverdue ? (
            <Typography
              variant="body2"
              color="error"
              sx={{
                animation: 'blink 1s step-start infinite',
                '@keyframes blink': {
                  '50%': { opacity: 0 },
                },
                mt: 1,
              }}
            >
              {timeRemaining}
            </Typography>
          ) : (
            <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
              <Schedule color="success" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <strong>Next watering in:</strong> {timeRemaining}
              </Typography>
            </Box>
          )}

          {/* Usamos el componente PlantStatus */}
          <PlantStatus plantId={plant.id} refreshStatus={refreshStatus} />
        </CardContent>
        <CardActions>
          <Button
            onClick={handleWaterPlant}
            variant="contained"
            color="primary"
            size="small"
            fullWidth
          >
            Water Plant
          </Button>
          <Tooltip title="View Care History">
            <IconButton onClick={fetchCareHistory} color="secondary">
              <History />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>

      {/* Popup del historial */}
      <PlantHistoryPopup
        open={historyPopupOpen}
        onClose={() => setHistoryPopupOpen(false)}
        history={careHistory}
        plantImage={plant.imageBase64}
        plantName={plant.name}
        location={plant.locationName}
      />

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default PlantCard;