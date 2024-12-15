import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { Close, Opacity, Done, WarningAmber, ErrorOutline } from '@mui/icons-material'; 
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
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Watering</Typography>
              </Box>
            );
          default:
            return <Typography variant="body2">{params.value}</Typography>;
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
            return <Typography variant="body2">{params.value}</Typography>;
        }
        return (
          <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
            {icon}
            <Typography variant="body2" color={color} sx={{ ml: 1, fontWeight: 'medium' }}>
              {text}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', position: 'relative' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Opacity color="primary" />
          {`Plant History: ${plantName}`}
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            ':hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {/* Imagen y ubicación */}
        <Box
          display="flex"
          alignItems="center"
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: 2
          }}
        >
          {plantImage && (
            <Avatar
              src={plantImage}
              alt="Plant"
              sx={{
                width: 60,
                height: 60,
                marginRight: '1rem',
                border: '2px solid #e0e0e0'
              }}
            />
          )}
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              <strong>Location:</strong> {location}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              <strong>Plant Name:</strong> {plantName}
            </Typography>
          </Box>
        </Box>

        {/* DataGrid */}
        <Box
          sx={{
            height: 400,
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: 2,
            overflow: 'hidden'
          }}
        >
          <DataGrid
            rows={formattedRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#fafafa',
                borderBottom: '1px solid #e0e0e0',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #f0f0f0',
              },
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default PlantHistoryPopup;