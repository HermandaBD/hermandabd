import axios from 'axios'

const hermanoApi = axios.create({
    baseURL: 'https://miguelybarra.pythonanywhere.com/api/v1/hermanos'
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
    return await hermanoApi.post('/', hermano);
};

export const getHermanos = async () => {
    try {
        return await hermanoApi.get('/');
    } catch (error) {
        console.error("Failed to get Hermanos: ", error);
        throw error;
    }
};

export const getHermano = async (id) => {
    try {
        return await hermanoApi.get(`/${id}`);
    } catch (error) {
        console.error("Failed to get Hermanos: ", error);
        throw error;
    }
};

export const deleteHermano = async (id) => {
    return await hermanoApi.delete(`/${id}`);
};

export const updateHermano = async (id, hermano) => {
    return await hermanoApi.put(`/${id}/`, hermano);
}