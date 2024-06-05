import axios from 'axios'
import { toast } from "react-toastify";
const authApi = axios.create({
    baseURL: 'http://localhost:8000'
})

authApi.interceptors.request.use(
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
export const registerAccount = async (user) => {
    try {
        const response = await authApi.post("/api/v1/users/", user);
        return response.success;
    } catch (error) {
        console.error("Failed to register new user: ", error);
        return false;
    }
};

export const login = async (credentials) => {
    try {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        const response = await authApi.post('/api/v1/token/login/', credentials);
        const token = response.data.auth_token;
        setToken(token);
        getCurrentUser();
        return response.data;
    } catch (error) {
        console.error("Failed to login:", error);
        throw error;
    }
};

export const getMeLogin = async () => {
    try {
        const response = await authApi.get('/api/v1/users/me');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch protected data:", error);
        throw error;
    }
};

export const activateAccount = async (uid, token) => {
    try {
        const response = await authApi.post('/api/v1/users/activation/', { uid, token });
        return response;
    } catch (error) {
        return false;
    }
};

export const getCurrentUser = async () => {
    await authApi
        .get("/api/v1/users/me/")
        .then(response => {
            const user = {
                username: response.data.username,
                email: response.data.email
            };
            setCurrentUser(user, '');
        })
        .catch(error => {
            unsetCurrentUser();
            if (error.response) {
                if (
                    error.response.status === 401 &&
                    error.response.hasOwnProperty("data") &&
                    error.response.data.hasOwnProperty("detail") &&
                    error.response.data["detail"] === "User inactive or deleted."
                ) {
                    /* dispatch(push("/resend_activation")); */
                }
            } else {
                console.error(error);
            }
        });
};

export const setCurrentUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
};

export const setToken = token => {
    localStorage.setItem("auth_token", token);
};

export const logout = () => {
    
    authApi.post("/api/v1/token/logout/");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    toast.success("Logout successful.");
    
};

export const unsetCurrentUser = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
};

