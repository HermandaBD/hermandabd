import axios from 'axios'

const eventoApi = axios.create({
    baseURL: 'https://miguelybarra.pythonanywhere.com/api/v1/eventos'
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

    return await eventoApi.post('/', evento);

};

export const getEventos = async () => {
    try {
        return await eventoApi.get('/');
    } catch (error) {
        console.error("Failed to get Eventos: ", error);
        throw error;
    }
};

export const getEvento = async (id) => {
    try {
        return await eventoApi.get(`/${id}`);
    } catch (error) {
        console.error("Failed to get Evento: ", error);
        throw error;
    }
};

export const deleteEvento = async (id) => {

    return await eventoApi.delete(`/${id}`);

};

export const updateEvento = async (id, evento) => {

    return await eventoApi.put(`/${id}/`, evento);

}