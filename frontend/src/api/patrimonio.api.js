import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL;
const patrimonioApi = axios.create({
    baseURL: `${apiUrl}/api/v1/patrimonios`
})

patrimonioApi.interceptors.request.use(
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

export const createPatrimonio = async (patrimonio) => {
        return await patrimonioApi.post('/', patrimonio);
};

export const getPatrimonios = async () => {
    try {
        return await patrimonioApi.get('/');
    } catch (error) {
        console.error("Failed to get Patrimonios: ", error);
        throw error;
    }
};

export const getPatrimonio = async (id) => {
    try {
        return await patrimonioApi.get(`/${id}`);
    } catch (error) {
        console.error("Failed to get Patrimonio: ", error);
        throw error;
    }
};

export const deletePatrimonio = async (id) => {
    try {
        return await patrimonioApi.delete(`/${id}`);
    } catch (error) {
        console.error("Failed to delete Patrimonio: ", error);
        throw error;
    }
};

export const updatePatrimonio = async (id, patrimonio) => {
        return await patrimonioApi.put(`/${id}/`, patrimonio);
}