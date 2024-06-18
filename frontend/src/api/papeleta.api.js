import axios from 'axios'

const papeletaApi = axios.create({
    baseURL: 'https://miguelybarra.pythonanywhere.com/api/v1/papeletasitios'
})

papeletaApi.interceptors.request.use(
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


export const generatePapeleta = async (id) => {
    try {
        const response = await papeletaApi.get(`/generate_papeleta/${id}`, { responseType: 'blob' });
        return response.data; // Retorna directamente el Blob del PDF
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        throw error;
    }
};

export const createPapeleta = async (data) => {
    const formData = new FormData();

    // Agregar campos obligatorios
    formData.append('nombre_evento', data.nombre_evento);
    formData.append('ubicacion', data.ubicacion);
    formData.append('fecha', data.fecha);
    formData.append('hora', data.hora);
    formData.append('puesto', data.puesto);
    formData.append('valor', data.valor);
    if (data.hermano && data.hermano.length > 0) {
        data.hermano.forEach(hermanoId => {
            formData.append("hermano", hermanoId);
        });
    }
    formData.append('hermandad', data.hermandad);

    // Verificar si se adjunta un archivo en el campo diseno antes de agregarlo al formData
    if (data.diseno && data.diseno.length > 0) {
        formData.append('diseno', data.diseno[0]);
    }

    try {
        const response = await papeletaApi.post('/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        console.error('Error al crear la papeleta:', error);
        throw error; // Puedes manejar el error como prefieras aquí
    }
};

export const getPapeletas = async () => {
    try {
        return await papeletaApi.get('/');
    } catch (error) {
        console.error("Failed to get Papeletas: ", error);
        throw error;
    }
};

export const getPapeleta = async (id) => {
    try {
        return await papeletaApi.get(`/${id}`);
    } catch (error) {
        console.error("Failed to get Papeleta: ", error);
        throw error;
    }
};

export const deletePapeleta = async (id) => {
    try {
        return await papeletaApi.delete(`/${id}`);
    } catch (error) {
        console.error("Failed to delete papeleta: ", error);
        throw error;
    }
};

export const updatePapeleta = async (id, data) => {
    const formData = new FormData();

    formData.append('nombre_evento', data.nombre_evento);
    formData.append('ubicacion', data.ubicacion);
    formData.append('fecha', data.fecha);
    formData.append('hora', data.hora);
    formData.append('puesto', data.puesto);
    formData.append('valor', data.valor);
    if (data.hermano && data.hermano.length > 0) {
        data.hermano.forEach(hermanoId => {
            formData.append("hermano", hermanoId);
        });
    }
    formData.append('hermandad', data.hermandad);

    // Verificar si se adjunta un archivo en el campo diseno antes de agregarlo al formData
    if (data.diseno && data.diseno.length > 0) {
        formData.append('diseno', data.diseno[0]);
    }
    try {
        return await papeletaApi.put(`/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    } catch (error) {
        console.error("Failed to update papeleta: ", error);
        throw error;
    }


}