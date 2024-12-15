import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { ErrorOutline, WarningAmber, CheckCircle } from '@mui/icons-material'; // Íconos para cada estado
import { getPlantWateringStatus } from '../../services/plantsService';

function PlantStatus({ plantId, refreshStatus }) {
  const [status, setStatus] = useState('Loading...');
  const [color, setColor] = useState('textSecondary');
  const [icon, setIcon] = useState(null);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    try {
      setError(null);
      const result = await getPlantWateringStatus(plantId);
      setStatus(result);

      // Cambiar color e ícono dependiendo del estado
      switch (result) {
        case 'Overdue':
          setColor('error');
          setIcon(<ErrorOutline color="error" sx={{ mr: 1 }} />);
          break;
        case 'Due Soon':
          setColor('warning.main');
          setIcon(<WarningAmber sx={{ color: 'warning.main', mr: 1 }} />);
          break;
        case 'OK':
          setColor('success.main');
          setIcon(<CheckCircle sx={{ color: 'success.main', mr: 1 }} />);
          break;
        default:
          setColor('textSecondary');
          setIcon(null);
      }
    } catch (err) {
      setError('Failed to fetch status');
    }
  };

  useEffect(() => {
    // Llamar a fetchStatus cuando se monte el componente o cambie refreshStatus
    fetchStatus();
  }, [plantId, refreshStatus]); // Escucha cambios en refreshStatus

  if (error) {
    return (
      <Typography variant="body2" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Box display="flex" alignItems="center">
      {icon}
      <Typography variant="body2" sx={{ color }}>
        Status: {status}
      </Typography>
    </Box>
  );
}

export default PlantStatus;