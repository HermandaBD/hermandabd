import axios from 'axios'

const hermandadApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1/hermandades'
})

hermandadApi.interceptors.request.use(
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

export const createHermandad = async (hermandad) => {
    try {
        return await hermandadApi.post('/', hermandad);
    } catch (error) {
        console.error("Failed to create Hermandad: ", error);
        throw error;
    }
};

export const getHermandades = async () => {
    try {
        return await hermandadApi.get('/');
    } catch (error) {
        console.error("Failed to get Hermandades: ", error);
        throw error;
    }
}