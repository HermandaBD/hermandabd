import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

export function NoHermandad() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      bgcolor="#f9f9f9"
      p={4}
      borderRadius={2}
      boxShadow={3}
    >
      <WarningIcon color="error" style={{ fontSize: 60 }} />
      <Typography variant="h5" color="textPrimary" gutterBottom>
        Acceso Restringido
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Aún no puedes acceder a este contenido porque no tienes asignada una hermandad.
      </Typography>
      <Button variant="contained" color="primary">
        Contactar Soporte
      </Button>
    </Box>
  );
}
