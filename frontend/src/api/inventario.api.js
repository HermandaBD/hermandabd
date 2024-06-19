import axios from 'axios'

const inventarioApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1/inventarios'
})

inventarioApi.interceptors.request.use(
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

export const createInventario = async (inventario) => {
    return await inventarioApi.post('/', inventario);
};

export const getInventarios = async () => {
    try {
        return await inventarioApi.get('/');
    } catch (error) {
        console.error("Failed to get Inventarios: ", error);
        throw error;
    }
};

export const getInventario = async (id) => {
    try {
        return await inventarioApi.get(`/${id}`);
    } catch (error) {
        console.error("Failed to get Inventario: ", error);
        throw error;
    }
};

export const deleteInventario = async (id) => {
    return await inventarioApi.delete(`/${id}`);
};

export const updateInventario = async (id, inventario) => {
    return await inventarioApi.put(`/${id}/`, inventario);
}