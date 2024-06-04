import axios from 'axios'

const eventoApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1/eventos'
})

eventoApi.interceptors.request.use(
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

export const createEvento = async (evento) => {
    try {
        return await eventoApi.post('/', evento);
    } catch (error) {
        console.error("Failed to create Evento: ", error);
        throw error;
    }
};

export const getEventos = async () => {
    try {
        return await eventoApi.get('/');
    } catch (error) {
        console.error("Failed to get Eventos: ", error);
        throw error;
    }
}