import axios from 'axios';

const BASE_URL = 'https://localhost:7018/api';

// Almacenamiento interno para plantas
let cachedPlants = null; // Caché para las plantas
let lastFetched = null; // Momento de la última llamada
const CACHE_DURATION = 60000; // 1 minuto (en milisegundos)

// Función para manejar errores
const handleResponse = (response) => {
    if (response.data.hasErrors) {
        throw new Error(response.data.errors.join(', '));
    }
    return response.data.data;
};

// Función para obtener todas las plantas (con caché)
export const getPlants = async () => {
    const now = Date.now();
    if (cachedPlants && lastFetched && now - lastFetched < CACHE_DURATION) {
        return cachedPlants; // Devuelve los datos en caché si no han expirado
    }

    try {
        const response = await axios.get(`${BASE_URL}/Plants`);
        cachedPlants = handleResponse(response); // Actualiza el caché
        lastFetched = now;
        return cachedPlants;
    } catch (error) {
        console.error('Error fetching plants:', error);
        throw error;
    }
};

export const addPlant = async (plant) => {

    const payload = {
        name: plant.name || '',
        plantTypeId: plant.plantTypeId,
        locationId: plant.locationId,
        wateringFrequencyDays: plant.wateringFrequencyDays || 0,
        imageBase64: plant.imageBase64 || null, // Imagen opcional
    };

    try {
        const response = await axios.post(`${BASE_URL}/Plants`, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });


        cachedPlants = null;

        return handleResponse(response);
    } catch (error) {
        if (error.response && error.response.data) {

            const serverErrors = error.response.data.errors;
            if (serverErrors) {

                const errorMessage = serverErrors.join(', ');
                throw new Error(errorMessage);
            }
        }

        throw new Error('An unexpected error occurred while adding the plant.');
    }
};

// Función para regar una planta
export const waterPlant = async (id) => {
    try {
        const response = await axios.put(`${BASE_URL}/Plants/${id}/water`);
        cachedPlants = null; // Invalida el caché después de regar
        return handleResponse(response);
    } catch (error) {
        console.error(`Error watering plant with id ${id}:`, error);
        throw error;
    }
};

export const getPlantWateringStatus = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/Plants/${id}/status`);
        return handleResponse(response);
    } catch (error) {
        console.error(`Error fetching watering status for plant with id ${id}:`, error);
        throw error;
    }
};

// Función para obtener una planta específica por ID
export const getPlantById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/Plants/${id}`);
        return handleResponse(response);
    } catch (error) {
        console.error(`Error fetching plant with id ${id}:`, error);
        throw error;
    }
};

export const getPlantCareHistory = async (plantId) => {
    try {
        const response = await axios.get(`${BASE_URL}/PlantCareHistory/${plantId}`);
        return handleResponse(response); // Manejo de la respuesta
    } catch (error) {
        console.error(`Error fetching care history for plant with id ${plantId}:`, error);
        throw error;
    }
};

export const getPlantTypes = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/PlantType`);
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching plant types:', error);
        throw error;
    }
};

export const getLocations = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Location`);
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
};

export const addLocation = async (location) => {
    try {
        const response = await axios.post(`${BASE_URL}/Location`, {
            name: capitalizeName(location.name),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error adding location:', error);
        throw error;
    }
};

export const addPlantType = async (plantType) => {
    try {
        const response = await axios.post(`${BASE_URL}/PlantType`, {
            name: capitalizeName(plantType.name),
            description: plantType.description || '',
            defaultImageBase64: plantType.defaultImageBase64 || null,
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error adding plant type:', error);
        throw error;
    }
};

export const getWateredThisWeekStats = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/PlantCareHistory/stats/watered-this-week`);
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching watered-this-week stats:', error);
        throw error;
    }
};

const capitalizeName = (name) => {
    if (!name.trim()) return '';
    return name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
};