import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Typography,
  Box,
} from '@mui/material';
import { Close, Opacity, Schedule, Done, WarningAmber, ErrorOutline } from '@mui/icons-material'; // Íconos de acción
import { DataGrid } from '@mui/x-data-grid';

function PlantHistoryPopup({ open, onClose, history = [], plantImage, plantName, location = 'Unknown' }) {
  const [formattedRows, setFormattedRows] = useState([]);

  useEffect(() => {
    if (open) {
      // Limpiar localStorage al abrir el popup
      localStorage.removeItem('plantHistory');

      // Formatear datos para la grilla
      const rows = history.map((event, index) => {
        const eventDate = new Date(event.careDate);
        return {
          id: event.id || index, // Garantizar un ID único
          date: eventDate ? eventDate.toLocaleDateString('en-US') : 'N/A',
          time: eventDate ? eventDate.toLocaleTimeString('en-US') : 'N/A',
          action: event.careType || 'Unknown',
          notes: event.notes || 'No notes',
        };
      });

      setFormattedRows(rows);
    }
  }, [open, history]);

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      width: 100,
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 100,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        // Mostrar ícono según el tipo de acción
        switch (params.value) {
          case 'Watering':
            return (
              <Box display="flex" alignItems="center">
                <Opacity color="info" sx={{ mr: 1 }} />
                Watering
              </Box>
            );
          default:
            return params.value;
        }
      },
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 250,
      renderCell: (params) => {
        // Colorear y mostrar íconos según el contenido de las notas
        let icon, color, text;
        switch (params.value) {
          case 'Watered on time':
            icon = <Done color="success" />;
            color = 'success.main';
            text = 'On Time';
            break;
          case 'Watered late':
            icon = <ErrorOutline color="error" />;
            color = 'error.main';
            text = 'Late';
            break;
          case 'Watered too early':
            icon = <WarningAmber color="warning" />;
            color = 'warning.main';
            text = 'Too Early';
            break;
          default:
            return params.value;
        }
        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ height: '100%' }}
          >
            {icon}
            <Typography variant="body2" color={color} sx={{ ml: 1 }}>
              {text}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {`Plant History: ${plantName}`}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Imagen y ubicación */}
        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
          {plantImage && (
            <Avatar
              src={plantImage}
              alt="Plant"
              sx={{
                width: 60,
                height: 60,
                marginRight: '1rem',
              }}
            />
          )}
          <Box>
            <Typography variant="body1">
              <strong>Location:</strong> {location}
            </Typography>
            <Typography variant="body1">
              <strong>Plant Name:</strong> {plantName}
            </Typography>
          </Box>
        </Box>

        {/* DataGrid */}
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={formattedRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.9rem',
                alignItems: 'center', 
                display: 'flex',
              },
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PlantHistoryPopup;