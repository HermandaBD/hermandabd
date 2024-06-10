import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Button, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { activateAccount } from '../api/auth.api';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

export function ActivateAccountPage() {
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function activate(uid, token) {
      try {
        const success = await activateAccount(uid, token);
        if (success) {
          setState('Success');
          toast.success('Cuenta activada con éxito');
        } else {
          setState('Error');
          toast.error('Ocurrió un error al intentar activar la cuenta');
        }
      } catch (error) {
        setState('Error');
        toast.error('Ocurrió un error al intentar activar la cuenta');
        throw error;
      } finally {
        setLoading(false);
      }
    }
    activate(params.uid, params.token);
  }, [params.uid, params.token]);

  if (loading) {
    return (
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
          <CircularProgress />
          <Typography variant="h6" color="textSecondary" mt={2}>
            Cargando...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        {state === 'Success' ? (
          <>
            <CheckCircleIcon color="success" style={{ fontSize: 60 }} />
            <Typography variant="h5" color="textPrimary" mt={2}>
              Enhorabuena, su cuenta fue activada con éxito!
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/login')} mt={2}>
              Inicie sesión
            </Button>
          </>
        ) : (
          <>
            <ErrorIcon color="error" style={{ fontSize: 60 }} />
            <Typography variant="h5" color="textPrimary" mt={2}>
              ¡Vaya! Ocurrió un problema al activar su cuenta
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => navigate('/contact')} mt={2}>
              Contactar Soporte
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}
