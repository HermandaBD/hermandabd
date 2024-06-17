import React from 'react'
import { Box, CircularProgress, Typography, Button, Container } from '@mui/material';

export function Cargando() {
    return <Container>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
            <CircularProgress />
            <Typography variant="h6" color="textSecondary" mt={2}>
                Cargando...
            </Typography>
        </Box>
    </Container>
}
