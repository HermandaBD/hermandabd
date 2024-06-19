import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL;
const bdAPI = axios.create({
    baseURL: `${apiUrl}/api/v1`
})

bdAPI.interceptors.request.use(
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

export const exportBD = async ()=> {
    try{
        const response = await bdAPI.get('/export', {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'hermandad_data.csv'); // Nombre del archivo
        document.body.appendChild(link);
        link.click();
        link.remove();
    }catch(error){
        console.error(error);
    }
}

export const importBD = async (model,formData) => {
    try {
        formData.append("model",model);
        const response = await bdAPI.post(`/import/${model}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const getEstadisticas = async () => {
    return await bdAPI.get('/statistics');
}