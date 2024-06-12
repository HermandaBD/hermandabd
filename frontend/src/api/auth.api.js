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
        return response;
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
            setCurrentUser(user);
            setHermandadUsuario(response.data.hermandad);
            setStaff(response.data.is_staff);
            setUserRol(response.data.rol);
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
                    toast.info("El usuario está desactivado, comprueba tu correo y activa la cuenta");
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

export const setHermandadUsuario = hermandad => {
    localStorage.setItem("hermandad_usuario", hermandad);
};

export const setStaff = staff => {
    localStorage.setItem("staff", staff);
}

export const setUserRol = userRol => {
    localStorage.setItem("user_rol", userRol);
}

export const unsetCurrentUser = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("hermandad_usuario");
    localStorage.removeItem("staff");
    localStorage.removeItem("user_rol");
};

export const logout = () => {

    authApi.post("/api/v1/token/logout/");
    unsetCurrentUser();

};

export const getUsers = async () => {
    const response = await authApi.get("/api/v1/users/");
    return response;
}

export const getUser = async (username) => {
    const response = await authApi.get(`/api/v1/users/${username}/`);
    return response;
}

export const modificarUsuario = async (username, data) => {
    const response = await authApi.put(`/api/v1/users/${username}/`, data);
    return response;
}