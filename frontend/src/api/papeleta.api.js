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
};

export const getPapeleta = async (id) => {
    try {
        return await papeletaApi.get(`/${id}`);
    } catch (error) {
        console.error("Failed to get Papeleta: ", error);
        throw error;
    }
};

export const deletePapeleta = async (id) => {
    try {
        return await papeletaApi.delete(`/${id}`);
    } catch (error) {
        console.error("Failed to delete papeleta: ", error);
        throw error;
    }
};

export const updatePapeleta = async (id, papeleta) => {
    try {
        return await papeletaApi.put(`/${id}/`, papeleta);
    } catch (error) {
        console.error("Failed to update papeleta: ", error);
        throw error;
    }


}