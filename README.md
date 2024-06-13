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

### 3. Instalar Requerimientos de Django
Dirígete a la carpeta /backend e instala los requerimientos:

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

### Contribuciones
Las contribuciones son bienvenidas.
