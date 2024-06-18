import axios from 'axios'

const hermandadApi = axios.create({
    baseURL: 'https://miguelybarra.pythonanywhere.com/api/v1/hermandades'
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
    return await hermandadApi.post('/', hermandad);
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
    return await hermandadApi.delete(`/${id}`);
};

export const updateHermandad = async (id, hermandad) => {

    return await hermandadApi.put(`/${id}/`, hermandad);

}