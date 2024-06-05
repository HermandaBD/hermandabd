import axios from 'axios'

const documentoApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1/documentos'
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
    try {
        const formData = new FormData();
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
        return response.status;
    } catch (error) {
        console.error("Failed to create Documento: ", error);
        return false;
    }
};

export const getDocumentos = async () => {
    try {
        return await documentoApi.get('/');
    } catch (error) {
        console.error("Failed to get Documentos: ", error);
        throw error;
    }
}