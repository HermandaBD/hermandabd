import axios from 'axios'

const hermanoApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1/hermanos'
})

hermanoApi.interceptors.request.use(
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

export const createHermano = async (hermano) => {
    try {
        return await hermanoApi.post('/', hermano);
    } catch (error) {
        console.error("Failed to create Hermano: ", error);
        throw error;
    }
};

export const getHermanos = async () => {
    try {
        return await hermanoApi.get('/');
    } catch (error) {
        console.error("Failed to get Hermanos: ", error);
        throw error;
    }
}