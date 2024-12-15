import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { GitHub, LinkedIn } from '@mui/icons-material';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 2,
        backgroundColor: '#2e7d32',
        color: '#fff',
        textAlign: 'center',
        borderRadius: 2,
        mx: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        Ing. Wilfredo Yupanqui © {currentYear}
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 1, gap: 2 }}>
        <IconButton
          component={Link}
          href="https://www.linkedin.com/in/wilfredo-yupanqui/"
          target="_blank"
          rel="noopener"
          sx={{ color: '#fff' }}
        >
          <LinkedIn />
        </IconButton>
        <IconButton
          component={Link}
          href="https://github.com/wilino"
          target="_blank"
          rel="noopener"
          sx={{ color: '#fff' }}
        >
          <GitHub />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Footer;