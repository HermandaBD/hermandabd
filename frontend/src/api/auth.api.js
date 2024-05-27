import axios from 'axios'

const authApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1'
})

authApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('auth_token');
        console.log(token)
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export const login = async (credentials) => {
    try {
        const response = await authApi.post('/token/login/', credentials);
        const token = response.data.auth_token;  // Suponiendo que el token está en 'auth_token' en la respuesta
        console.log(response)
        localStorage.setItem('auth_token', token);
        return response.data;
    } catch (error) {
        console.error("Failed to login:", error);
        throw error;
    }
};

export const getMeLogin = async () => {
    try {
        const response = await authApi.get('/users/me');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch protected data:", error);
        throw error;
    }
};