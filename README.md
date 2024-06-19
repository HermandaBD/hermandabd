[![Netlify Status](https://api.netlify.com/api/v1/badges/d54e4c44-ef38-412a-9384-26403bcc8bce/deploy-status)](https://app.netlify.com/sites/hermandabd/deploys)
# Hermandabd

**Hermandabd** es un software de gestión de hermandades, desarrollado como parte del Trabajo Fin de Grado para el grado de Ingeniería del Software. Con **Hermandabd** puedes gestionar hermanos, pagos, documentos, archivos, patrimonio, cartas papeletas de sitio y más.

## Características

- Gestión de hermanos
- Control de pagos
- Administración de documentos y archivos
- Gestión de patrimonio
- Generación de cartas y papeletas de sitio
- Y más...

## Requisitos

- Python 3.11
- Node.js (NPM)

## Instalación y Uso

Para usar **Hermandabd** localmente, sigue estos pasos:

### 1. Clonar el Repositorio

Clona el repositorio en una carpeta local:

```bash
git clone urlRepositorio
```

### 2. Configurar el Entorno Virtual de Python
Crea y activa un entorno virtual de Python.

### 3. Instalar Requerimientos de Django y .env
Dirígete a la carpeta /backend e instala los requerimientos:
En este directorio crear un archivo .env con las variables GOOGLE_PASSWORD y GOOGLE_USER, donde respectivamente corresponden a contraseña creada para la aplicación y correo de google para hacer los envíos de emails.
Si no se quiere hacer el envío de correo cambiar en el archivo settings.py la configuración de backend de correo. (La opción de correo por consola está comentada)
```bash
pip install -r requirements.txt
```

### 4. Configurar y Ejecutar el Servidor de Django
Realiza las migraciones y ejecuta el servidor de desarrollo de Django:

```bash
python manage.py migrate
python manage.py runserver
```

El servidor debería estar configurado para correr en localhost:8000.

### 5. Instalar Dependencias de Node
Regresa al directorio raíz y entra a la carpeta /frontend. Instala los paquetes necesarios:
También dentro de este directorio crea un archivo .env con la variable VITE_API_URL con la url local del backend de django, normalmente http://localhost:8000
```bash
npm install
```

### 6. Ejecutar el Servidor de Desarrollo de Node
Una vez instaladas las dependencias, ejecuta el siguiente comando:

```bash
npm run dev
```

El servidor debería iniciarse en localhost:3000.

¡Y ya está! Ahora puedes empezar a usar Hermandabd en tu entorno local.

### Para empezar
Para probarlo correctamente, hay que crear un superuser django, con este puedes iniciar sesión desde el frontend para acciones reservadas para este rol, como por ejemplo crear una hermandad y asignarla a un usuario existente.

```python
manage.py createsuperuser
```

Al crear una cuenta debería llegar al correo (si lo configuración es correcta) de activación de cuenta. 

### Contribuciones
Las contribuciones son bienvenidas.
