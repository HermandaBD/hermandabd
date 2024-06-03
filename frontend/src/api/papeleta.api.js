import axios from 'axios'

const papeletaApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1/papeletasitios'
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

export const createPapeleta = async (papeleta) => {
    try {
        return await papeletaApi.post('/', papeleta);
    } catch (error) {
        console.error("Failed to create Papeleta: ", error);
        throw error;
    }
};

export const getPapeletas = async () => {
    try {
        return await papeletaApi.get('/');
    } catch (error) {
        console.error("Failed to get Papeletas: ", error);
        throw error;
    }
}