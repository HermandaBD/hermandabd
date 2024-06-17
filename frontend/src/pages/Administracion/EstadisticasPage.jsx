import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getEstadisticas } from '../../api/bd.api';
import { Cargando } from '../../components/Cargando';
import { CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChurch, faFileAlt, faTags, faDollarSign, faEnvelope, faCalendarAlt, faGavel } from '@fortawesome/free-solid-svg-icons';

export function EstadisticasPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getEstadisticas();
                setStats(response.data);
            } catch (error) {
                throw error;
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <Cargando />;

    const statsData = [
        { label: 'Número de hermandades', value: stats.num_hermandades, icon: faChurch },
        { label: 'Promedio de hermanos por hermandad', value: stats.promedio_hermanos_por_hermandad.toFixed(2), icon: faUsers },
        { label: 'Número de eventos', value: stats.num_eventos, icon: faCalendarAlt },
        { label: 'Número de documentos subidos', value: stats.num_documentos, icon: faFileAlt },
        { label: 'Número de etiquetas', value: stats.num_etiquetas, icon: faTags },
        { label: 'Valor total del patrimonio', value: `${stats.valor_total_patrimonio}€`, icon: faDollarSign },
        { label: 'Número de papeletas de sitio emitidas', value: stats.num_papeletas, icon: faGavel },
        { label: 'Número de cartas enviadas', value: stats.num_cartas, icon: faEnvelope },
        { label: 'Número de pagos realizados', value: stats.num_pagos, icon: faDollarSign },
    ];

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <Typography variant="h4" className="text-center mb-8 p-8">Números totales/estadísticas</Typography>
            <Grid container spacing={4}>
                {statsData.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper className="p-4 flex flex-col items-center shadow-md">
                            <FontAwesomeIcon icon={stat.icon} size="2x" className="text-blue-500 mb-4" />
                            <Typography variant="h6" className="text-center">{stat.label}</Typography>
                            <Typography variant="h4" className="text-center">{stat.value}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
