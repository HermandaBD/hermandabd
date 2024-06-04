import axios from 'axios'

const cartaApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1/cartas'
})

cartaApi.interceptors.request.use(
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

export const createCarta = async (carta) => {
    try {
        return await cartaApi.post('/', carta);
    } catch (error) {
        console.error("Failed to create Carta: ", error);
        throw error;
    }
};

export const getCartas = async () => {
    try {
        return await cartaApi.get('/');
    } catch (error) {
        console.error("Failed to get Cartas: ", error);
        throw error;
    }
}