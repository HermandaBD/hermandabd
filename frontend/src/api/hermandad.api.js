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
};

export const getHermandad = async (id) => {
    try {
        return await hermandadApi.get(`/${id}`);
    } catch (error) {
        console.error("Failed to get Hermandad: ", error);
        throw error;
    }
};

export const deleteHermandad = async (id) => {
    try {
        return await hermandadApi.delete(`/${id}`);
    } catch (error) {
        console.error("Failed to delete Hermandad: ", error);
        throw error;
    }
};

export const updateHermandad = async (id, hermandad) => {
    try {
        return await hermandadApi.put(`/${id}/`, hermandad);
    } catch (error) {
        console.error("Failed to update Hermandad: ", error);
        throw error;
    }


}