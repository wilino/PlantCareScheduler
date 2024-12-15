import React, { useState, useCallback } from 'react';
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
    Card,
    CardHeader,
    CardContent,
    Divider,
    InputAdornment
} from '@mui/material';
import { Add, Save, LocalFlorist, Category, Place, Opacity, CloudUpload } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

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
    const [alertSeverity, setAlertSeverity] = useState('success'); 
    const [alertOpen, setAlertOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
            wateringFrequencyDays: parseInt(formData.wateringFrequencyDays, 10) || 1,
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
                const newType = await onAddPlantType(formattedType);
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
                const newLoc = await onAddLocation(formattedLocation);
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

    // Manejo de dropzone
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file) {
                setLoadingImage(true);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData((prev) => ({ ...prev, image: reader.result }));
                    setLoadingImage(false);
                };
                reader.readAsDataURL(file);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ pb: 0 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Add New Plant
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pt: 1 }}>
                    <Card variant="outlined">
                        <CardHeader
                            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                            title="Plant Details"
                            avatar={<LocalFlorist color="primary" />}
                        />
                        <CardContent>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <TextField
                                    label="Plant Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    disabled={isFormDisabled}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocalFlorist color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                    fullWidth
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
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Category color="action" />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                                <IconButton onClick={handleAddPlantType}>
                                                    <Save color="primary" />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <>
                                                <FormControl sx={{ flexGrow: 1 }}>
                                                    <InputLabel>Plant Type</InputLabel>
                                                    <Select
                                                        name="plantTypeId"
                                                        value={formData.plantTypeId}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        disabled={isFormDisabled}
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <Category color="action" />
                                                            </InputAdornment>
                                                        }
                                                    >
                                                        {plantTypes.map((type) => (
                                                            <MenuItem key={type.id} value={type.id}>
                                                                {type.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
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
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Place color="action" />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                                <IconButton onClick={handleAddLocation}>
                                                    <Save color="primary" />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <>
                                                <FormControl sx={{ flexGrow: 1 }}>
                                                    <InputLabel>Location</InputLabel>
                                                    <Select
                                                        name="locationId"
                                                        value={formData.locationId}
                                                        onChange={handleChange}
                                                        fullWidth
                                                        disabled={isFormDisabled}
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <Place color="action" />
                                                            </InputAdornment>
                                                        }
                                                    >
                                                        {locations.map((loc) => (
                                                            <MenuItem key={loc.id} value={loc.id}>
                                                                {loc.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Opacity color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                    fullWidth
                                />
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                    <CloudUpload sx={{ mr: 1 }} /> Image Upload
                                </Typography>
                                <Box 
                                    {...getRootProps()}
                                    sx={{
                                        border: '2px dashed #ccc',
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        padding: '20px',
                                        cursor: 'pointer',
                                        color: 'inherit'
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    {isDragActive ? (
                                        <Typography variant="body1">
                                            Drop the file here...
                                        </Typography>
                                    ) : (
                                        <Box>
                                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                                                {loadingImage ? 'Uploading...' : 'Drop files or click here'}
                                            </Typography>
                                            <Typography variant="body2">You can upload one image</Typography>
                                        </Box>
                                    )}
                                </Box>

                                {formData.image && (
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>Selected Image:</Typography>
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} color="error" disabled={isFormDisabled}>
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