import React, { useState, useEffect } from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { ErrorOutline, WarningAmber, CheckCircle } from '@mui/icons-material';
import { getPlantWateringStatus } from '../../services/plantsService';

function PlantStatus({ plantId, refreshStatus }) {
  const [status, setStatus] = useState('Loading...');
  const [chipProps, setChipProps] = useState({});
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    try {
      setError(null);
      const result = await getPlantWateringStatus(plantId);
      setStatus(result);

      // Configurar Chip según el estado
      switch (result) {
        case 'Overdue':
          setChipProps({
            label: 'Overdue',
            color: 'error',
            icon: <ErrorOutline sx={{ color: 'inherit' }} />,
          });
          break;
        case 'Due Soon':
          setChipProps({
            label: 'Due Soon',
            sx: { backgroundColor: 'warning.main', color: '#fff' },
            icon: <WarningAmber sx={{ color: '#fff' }} />,
          });
          break;
        case 'OK':
          setChipProps({
            label: 'OK',
            color: 'success',
            icon: <CheckCircle sx={{ color: 'inherit' }} />,
          });
          break;
        default:
          setChipProps({
            label: 'Unknown',
            sx: { backgroundColor: 'text.secondary', color: '#fff' },
          });
      }
    } catch (err) {
      setError('Failed to fetch status');
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [plantId, refreshStatus]);

  if (error) {
    return (
      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
        {error}
      </Typography>
    );
  }

  if (status === 'Loading...') {
    return (
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        {status}
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      <Chip
        {...chipProps}
        sx={{
          fontWeight: 'bold',
          ...chipProps.sx
        }}
      />
    </Box>
  );
}

export default PlantStatus;