import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL;
const documentoApi = axios.create({
    baseURL: `${apiUrl}/api/v1/documentos`
})

documentoApi.interceptors.request.use(
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

export const createDocumento = async (data) => {
    const formData = new FormData();
    let mime = data.archivo[0].type;
    formData.append('mime_type', mime.split('/')[1])
    formData.append('archivo', data.archivo[0]);
    formData.append('nombre', data.nombre);
    formData.append('hermandad', data.hermandad);
    console.log(data.etiquetas);
    if (data.etiquetas && data.etiquetas.length > 0) {
        data.etiquetas.forEach((etiquetaId) => {
            formData.append('etiquetas', etiquetaId);
        });
    }
    const response = await documentoApi.post('/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
};

export const getDocumentos = async () => {
    try {
        return await documentoApi.get('/');
    } catch (error) {
        console.error("Failed to get Documentos: ", error);
        throw error;
    }
}

export const deleteDocumento = async id => {
    return await documentoApi.delete(`/${id}`);
}