import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Dashboard from './components/Dashboard/Dashboard';
import theme from './styles/theme';
import './styles/index.css';
import { PlantsProvider } from './contexts/PlantsContext';

function App() {
  console.log('App rendered'); // Debug para monitorear renderizaciones

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PlantsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Router>
      </PlantsProvider>
    </ThemeProvider>
  );
}

export default App;