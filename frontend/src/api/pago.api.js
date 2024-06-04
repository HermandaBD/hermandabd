import axios from 'axios'

const pagoApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1/pagos'
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

export const createPago = async (pago) => {
    try {
        return await pagoApi.post('/', pago);
    } catch (error) {
        console.error("Failed to create Pago: ", error);
        throw error;
    }
};

export const getPagos = async () => {
    try {
        return await pagoApi.get('/');
    } catch (error) {
        console.error("Failed to get Pagos: ", error);
        throw error;
    }
}