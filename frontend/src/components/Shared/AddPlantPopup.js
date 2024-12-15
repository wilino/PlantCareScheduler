import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Alert,
    Snackbar,
} from '@mui/material';
import { Add, Save } from '@mui/icons-material';

function AddPlantPopup({ open, onClose, plantTypes, locations, onAddPlant, onAddPlantType, onAddLocation }) {
    const [formData, setFormData] = useState({
        name: '',
        plantTypeId: '',
        locationId: '',
        wateringFrequencyDays: '',
        image: null,
    });

    const [errors, setErrors] = useState({});
    const [newPlantType, setNewPlantType] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [addingPlantType, setAddingPlantType] = useState(false);
    const [addingLocation, setAddingLocation] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);

    // Estado para manejar los mensajes de alerta
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'
    const [alertOpen, setAlertOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoadingImage(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
                setLoadingImage(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.plantTypeId && !addingPlantType) newErrors.plantTypeId = 'Plant type is required.';
        if (!formData.locationId && !addingLocation) newErrors.locationId = 'Location is required.';
        if (!formData.wateringFrequencyDays) newErrors.wateringFrequencyDays = 'Watering frequency is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const payload = {
            ...formData,
            wateringFrequencyDays: parseInt(formData.wateringFrequencyDays, 10) || 1, // Valor predeterminado
        };

        try {
            await onAddPlant(payload);
            setAlertMessage('Plant added successfully!');
            setAlertSeverity('success');
            setAlertOpen(true);
            handleClose();
        } catch (error) {
            setAlertMessage('Failed to add plant. Please try again.');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const handleAddPlantType = async () => {
        const formattedType = newPlantType.trim().charAt(0).toUpperCase() + newPlantType.trim().slice(1).toLowerCase();
        const exists = plantTypes.some((type) => type.name.toLowerCase() === formattedType.toLowerCase());

        if (!exists && formattedType) {
            try {
                const response = await onAddPlantType(formattedType);

                if (response.hasErrors) {
                    setAlertMessage('Failed to add plant type.');
                    setAlertSeverity('error');
                    setAlertOpen(true);
                    return;
                }

                const newType = response.data; // Extrae el tipo de planta de la respuesta
                setAddingPlantType(false);
                setNewPlantType('');
                setFormData({ ...formData, plantTypeId: newType.id });
                setAlertMessage('Plant type added successfully!');
                setAlertSeverity('success');
                setAlertOpen(true);
            } catch (err) {
                setAlertMessage('Failed to add plant type.');
                setAlertSeverity('error');
                setAlertOpen(true);
            }
        } else {
            setAlertMessage('Plant type already exists.');
            setAlertSeverity('warning');
            setAlertOpen(true);
            setAddingPlantType(false);
            setNewPlantType('');
        }
    };

    const handleAddLocation = async () => {
        const formattedLocation = newLocation.trim().charAt(0).toUpperCase() + newLocation.trim().slice(1).toLowerCase();
        const exists = locations.some((loc) => loc.name.toLowerCase() === formattedLocation.toLowerCase());

        if (!exists && formattedLocation) {
            try {
                const response = await onAddLocation(formattedLocation);

                if (response.hasErrors) {
                    setAlertMessage('Failed to add location.');
                    setAlertSeverity('error');
                    setAlertOpen(true);
                    return;
                }

                const newLoc = response.data; // Extrae la ubicación de la respuesta
                setAddingLocation(false);
                setNewLocation('');
                setFormData({ ...formData, locationId: newLoc.id });
                setAlertMessage('Location added successfully!');
                setAlertSeverity('success');
                setAlertOpen(true);
            } catch (err) {
                setAlertMessage('Failed to add location.');
                setAlertSeverity('error');
                setAlertOpen(true);
            }
        } else {
            setAlertMessage('Location already exists.');
            setAlertSeverity('warning');
            setAlertOpen(true);
            setAddingLocation(false);
            setNewLocation('');
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            plantTypeId: '',
            locationId: '',
            wateringFrequencyDays: '',
            image: null,
        });
        setErrors({});
        onClose();
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const isFormDisabled = addingPlantType || addingLocation || loadingImage;

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Plant</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
                        <TextField
                            label="Plant Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            disabled={isFormDisabled}
                        />
                        <FormControl error={!!errors.plantTypeId} fullWidth>
                            <Box display="flex" alignItems="center">
                                {addingPlantType ? (
                                    <>
                                        <TextField
                                            label="New Plant Type"
                                            value={newPlantType}
                                            onChange={(e) => setNewPlantType(e.target.value)}
                                            fullWidth
                                        />
                                        <IconButton onClick={handleAddPlantType}>
                                            <Save color="primary" />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <InputLabel>Plant Type</InputLabel>
                                        <Select
                                            name="plantTypeId"
                                            value={formData.plantTypeId}
                                            onChange={handleChange}
                                            fullWidth
                                            disabled={isFormDisabled}
                                        >
                                            {plantTypes.map((type) => (
                                                <MenuItem key={type.id} value={type.id}>
                                                    {type.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <IconButton onClick={() => setAddingPlantType(true)}>
                                            <Add color="primary" />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                            <Typography variant="caption" color="error">
                                {errors.plantTypeId}
                            </Typography>
                        </FormControl>
                        <FormControl error={!!errors.locationId} fullWidth>
                            <Box display="flex" alignItems="center">
                                {addingLocation ? (
                                    <>
                                        <TextField
                                            label="New Location"
                                            value={newLocation}
                                            onChange={(e) => setNewLocation(e.target.value)}
                                            fullWidth
                                        />
                                        <IconButton onClick={handleAddLocation}>
                                            <Save color="primary" />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <InputLabel>Location</InputLabel>
                                        <Select
                                            name="locationId"
                                            value={formData.locationId}
                                            onChange={handleChange}
                                            fullWidth
                                            disabled={isFormDisabled}
                                        >
                                            {locations.map((loc) => (
                                                <MenuItem key={loc.id} value={loc.id}>
                                                    {loc.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <IconButton onClick={() => setAddingLocation(true)}>
                                            <Add color="primary" />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                            <Typography variant="caption" color="error">
                                {errors.locationId}
                            </Typography>
                        </FormControl>
                        <TextField
                            label="Watering Frequency (Days)"
                            name="wateringFrequencyDays"
                            type="number"
                            value={formData.wateringFrequencyDays}
                            onChange={handleChange}
                            error={!!errors.wateringFrequencyDays}
                            helperText={errors.wateringFrequencyDays}
                            disabled={isFormDisabled}
                        />
                        <Button variant="outlined" component="label" disabled={isFormDisabled}>
                            {loadingImage ? <CircularProgress size={24} /> : 'Upload Plant Image'}
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary" disabled={isFormDisabled}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained" disabled={isFormDisabled}>
                        Add Plant
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default AddPlantPopup;