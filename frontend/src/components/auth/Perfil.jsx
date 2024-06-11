import React from 'react';
import { Box, Typography, Avatar, Container } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export function Perfil({ me }) {
  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        p={4}
        bgcolor="#f9f9f9"
        borderRadius={2}
        boxShadow={3}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, mb: 2 }}>
          <AccountCircleIcon sx={{ fontSize: 60 }} />
        </Avatar>
        <Typography variant="h4" color="textPrimary" gutterBottom>
          Perfil de Usuario
        </Typography>
        <Box textAlign="center" mt={2}>
          <Typography variant="h6" color="textSecondary">
            Nombre de usuario
          </Typography>
          <Typography variant="body1" color="textPrimary" mb={2}>
            {me.username}
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Email
          </Typography>
          <Typography variant="body1" color="textPrimary">
            {me.email}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
