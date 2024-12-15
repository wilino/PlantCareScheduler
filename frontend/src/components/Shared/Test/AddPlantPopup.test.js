import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddPlantPopup from '../AddPlantPopup';
import '@testing-library/jest-dom';

describe('AddPlantPopup', () => {
  test('muestra errores de validación si se intenta agregar planta sin datos', () => {
    const mockOnAddPlant = jest.fn();
    render(
      <AddPlantPopup
        open={true}
        onClose={() => {}}
        plantTypes={[]}
        locations={[]}
        onAddPlant={mockOnAddPlant}
        onAddPlantType={() => {}}
        onAddLocation={() => {}}
      />
    );

    const addButton = screen.getByRole('button', { name: /Add Plant/i });
    fireEvent.click(addButton);


    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
  });
});