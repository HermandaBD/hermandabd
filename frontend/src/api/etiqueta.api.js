import axios from 'axios'

const etiquetaApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1/etiquetas'
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
    try {
        return await etiquetaApi.post('/', etiqueta);
    } catch (error) {
        console.error("Failed to create Etiqueta: ", error);
        throw error;
    }
};

export const getEtiquetas = async () => {
    try {
        return await etiquetaApi.get('/');
    } catch (error) {
        console.error("Failed to get Etiquetas: ", error);
        throw error;
    }
}