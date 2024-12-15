import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  CardHeader,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { WaterDrop, Schedule, Place, Opacity, History } from '@mui/icons-material';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plant.lastWateredDate, plant.wateringFrequencyDays]);

  // Formato de la última fecha de riego
  let lastWateredDisplay;
  if (plant.lastWateredDate === '0001-01-01T00:00:00') {
    lastWateredDisplay = 'No watering recorded';
  } else {
    const lastWatered = new Date(plant.lastWateredDate);
    lastWateredDisplay = lastWatered.toLocaleDateString('en-US'); // Formato: MM/DD/YYYY
  }

  return (
    <>
      <Card sx={{ maxWidth: 345, margin: '0 auto', boxShadow: 3, borderRadius: 3, overflow: 'hidden' }}>
        {/* Imagen con overlay degradado */}
        <Box 
          sx={{
            position: 'relative',
            height: 180,
            background: plant.imageBase64
              ? `url(${plant.imageBase64}) no-repeat center/cover`
              : 'linear-gradient(to bottom right, #e3f2fd, #90caf9)',
          }}
        >
          {!plant.imageBase64 && (
            <Typography
              variant="h6"
              sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                color: '#fff',
                fontWeight: 'bold',
                textShadow: '0 0 5px rgba(0,0,0,0.5)',
              }}
            >
              No Image
            </Typography>
          )}
        </Box>
        
        <CardHeader
          title={plant.name}
          titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
          sx={{ pt: 2, pb: 0 }}
        />

        <CardContent sx={{ pt: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip
              icon={<Opacity />}
              label={plant.plantTypeName}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
            <Chip
              icon={<Place />}
              label={plant.locationName}
              color="secondary"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Last Watered:</strong> {lastWateredDisplay}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Water Every:</strong> {plant.wateringFrequencyDays} days
          </Typography>

          {isOverdue ? (
            <Typography
              variant="body1"
              color="error"
              sx={{
                animation: 'blink 1s step-start infinite',
                '@keyframes blink': {
                  '50%': { opacity: 0 },
                },
                fontWeight: 'bold',
                mb: 1,
              }}
            >
              {timeRemaining}
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Next watering in:</strong> {timeRemaining}
            </Typography>
          )}

          <PlantStatus plantId={plant.id} refreshStatus={refreshStatus} />
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            onClick={handleWaterPlant}
            variant="contained"
            color="primary"
            size="small"
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

      <PlantHistoryPopup
        open={historyPopupOpen}
        onClose={() => setHistoryPopupOpen(false)}
        history={careHistory}
        plantImage={plant.imageBase64}
        plantName={plant.name}
        location={plant.locationName}
      />

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