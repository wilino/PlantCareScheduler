import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WeeklyStatsCard from './WeeklyStatsCard';
import { getWateredThisWeekStats } from '../../../services/plantsService';
import '@testing-library/jest-dom';

jest.mock('../../../services/plantsService');

describe('WeeklyStatsCard', () => {
  test('muestra cargando al inicio y luego el resultado', async () => {
    getWateredThisWeekStats.mockResolvedValueOnce(4);

    render(<WeeklyStatsCard />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('4')).toBeInTheDocument());
  });

  test('muestra error si la llamada falla', async () => {
    getWateredThisWeekStats.mockRejectedValueOnce(new Error('Failed to fetch stats'));

    render(<WeeklyStatsCard />);

    await waitFor(() => expect(screen.getByText(/Failed to fetch stats/i)).toBeInTheDocument());
  });

  test('permite refrescar los datos al hacer click en el botón de refresh', async () => {
    getWateredThisWeekStats.mockResolvedValueOnce(2); // Primer render
    render(<WeeklyStatsCard />);
    
    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument());

    getWateredThisWeekStats.mockResolvedValueOnce(5); // Al refrescar que devuelva 5

    const refreshButton = screen.getByRole('button', { name: /Refresh Stats/i });
    fireEvent.click(refreshButton);

    await waitFor(() => expect(screen.getByText('5')).toBeInTheDocument());
  });
});