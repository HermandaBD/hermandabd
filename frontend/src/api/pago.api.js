import axios from 'axios'

const pagoApi = axios.create({
    baseURL: 'https://miguelybarra.pythonanywhere.com/api/v1/pagos'
})

pagoApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export const generatePDF = async (id) => {
    try {
        const response = await pagoApi.get(`/generate_pdf/${id}`, { responseType: 'blob' });
        return response.data; // Retorna directamente el Blob del PDF
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        throw error;
    }
};

export const createPago = async (data) => {
    const formData = new FormData();
    formData.append('fecha', data.fecha);
    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    formData.append('valor', data.valor);
    formData.append('hermandad', data.hermandad);
    if (data.hermano && data.hermano.length > 0) {
        data.hermano.forEach(hermanoId => {
            formData.append("hermano", hermanoId);
        });
    }

    if (data.diseno && data.diseno.length > 0) {
        formData.append('diseno', data.diseno[0]);
    }

    const response = await pagoApi.post('/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
};
export const getPagos = async () => {
    try {
        return await pagoApi.get('/');
    } catch (error) {
        console.error("Failed to get Pagos: ", error);
        throw error;
    }
};

export const getPago = async (id) => {
    try {
        return await pagoApi.get(`/${id}`);
    } catch (error) {
        console.error("Failed to get Pago: ", error);
        throw error;
    }
};

export const deletePago = async (id) => {
    try {
        return await pagoApi.delete(`/${id}`);
    } catch (error) {
        console.error("Failed to delete pago: ", error);
        throw error;
    }
};

export const updatePago = async (id, pago) => {
    return await pagoApi.put(`/${id}/`, pago);
}