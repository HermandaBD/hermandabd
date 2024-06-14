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
    return await pagoApi.post('/', pago);
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