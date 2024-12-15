import { useState, useEffect } from 'react';

function useFetch(url, options = {}) {
  const [data, setData] = useState(null); // Datos obtenidos
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(null); // Manejo de errores

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, options); // Realizar la solicitud
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const result = await response.json(); // Parsear JSON
        setData(result); // Establecer los datos
      } catch (err) {
        setError(err.message); // Manejar errores
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    fetchData();
  }, [url, options]); // Se ejecutará cada vez que cambien la URL o las opciones

  return { data, loading, error };
}

export default useFetch;