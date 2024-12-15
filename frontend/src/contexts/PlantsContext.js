import React, { createContext, useState, useEffect } from 'react';
import { getPlants } from '../services/plantsService';

export const PlantsContext = createContext();

export const PlantsProvider = ({ children }) => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlants = async () => {
    try {
      const data = await getPlants();
      setPlants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants(); // Llama al servicio solo una vez
  }, []);

  return (
    <PlantsContext.Provider value={{ plants, loading, error, fetchPlants }}>
      {children}
    </PlantsContext.Provider>
  );
};