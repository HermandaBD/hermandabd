import axios from 'axios'

const documentoApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1/documentos'
})

documentoApi.interceptors.request.use(
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

export const createDocumento = async (documento) => {
    try {
        return await documentoApi.post('/', documento);
    } catch (error) {
        console.error("Failed to create Documento: ", error);
        throw error;
    }
};

export const getDocumentos = async () => {
    try {
        return await documentoApi.get('/');
    } catch (error) {
        console.error("Failed to get Documentos: ", error);
        throw error;
    }
}