import axios from 'axios'

const patrimonioApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1/patrimonios'
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
    try {
        return await patrimonioApi.post('/', patrimonio);
    } catch (error) {
        console.error("Failed to create Patrimonio: ", error);
        throw error;
    }
};

export const getPatrimonios = async () => {
    try {
        return await patrimonioApi.get('/');
    } catch (error) {
        console.error("Failed to get Patrimonios: ", error);
        throw error;
    }
}