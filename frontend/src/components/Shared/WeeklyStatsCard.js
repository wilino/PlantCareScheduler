import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Refresh, Opacity } from '@mui/icons-material';
import { getWateredThisWeekStats } from '../../services/plantsService';

function WeeklyStatsCard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getWateredThisWeekStats();
      setCount(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Card sx={{ mt: 4, boxShadow: 3, borderRadius: 2, backgroundColor: '#f0f0f0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Opacity color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Plants Watered This Week
            </Typography>
          </Box>
          <Tooltip title="Refresh Stats">
            <IconButton onClick={fetchStats} sx={{ ':hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
            {error}
          </Typography>
        ) : (
          <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 2, textAlign: 'center' }}>
            {count}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default WeeklyStatsCard;