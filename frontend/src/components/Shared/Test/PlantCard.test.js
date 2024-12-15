import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlantCard from './PlantCard';
import { waterPlant, getPlantById } from '../../../services/plantsService';
import '@testing-library/jest-dom';

jest.mock('../../../services/plantsService');

describe('PlantCard', () => {
  test('riego de planta actualiza estado', async () => {
    const mockPlant = {
      id: '1',
      name: 'Fern',
      plantTypeName: 'Tropical',
      locationName: 'Kitchen',
      wateringFrequencyDays: 2,
      lastWateredDate: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000)).toISOString(), 
      imageBase64: null
    };

    waterPlant.mockResolvedValueOnce('Watered successfully');
    getPlantById.mockResolvedValueOnce({ ...mockPlant, lastWateredDate: new Date().toISOString() });

    render(<PlantCard plant={mockPlant} />);

    const waterButton = screen.getByRole('button', { name: /Water Plant/i });
    fireEvent.click(waterButton);

    // Esperar a que el mock se resuelva y la UI se actualice
    await waitFor(() => expect(waterPlant).toHaveBeenCalledWith('1'));
    await waitFor(() => expect(getPlantById).toHaveBeenCalledWith('1'));
  });
});