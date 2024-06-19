import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL;
const etiquetaApi = axios.create({
    baseURL: `${apiUrl}/api/v1/etiquetas`
})

etiquetaApi.interceptors.request.use(
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

export const createEtiqueta = async (etiqueta) => {
        return await etiquetaApi.post('/', etiqueta);
};

export const getEtiquetas = async () => {
    try {
        return await etiquetaApi.get('/');
    } catch (error) {
        console.error("Failed to get Etiquetas: ", error);
        throw error;
    }
};

export const getEtiqueta = async (id) => {
    try {
        return await etiquetaApi.get(`/${id}`);
    } catch (error) {
        console.error("Failed to get Etiquetas: ", error);
        throw error;
    }
};

export const deleteEtiqueta = async (id) => {
        return await etiquetaApi.delete(`/${id}`);
};

export const updateEtiqueta = async (id, etiqueta) => {
    return await etiquetaApi.put(`/${id}/`, etiqueta);
}