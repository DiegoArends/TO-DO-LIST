# 📋 Lista de Tareas - Instrucciones de Instalación

## 🎯 Descripción
Aplicación web completa de lista de tareas desarrollada con Node.js, Express, HTML, CSS y JavaScript. Incluye funcionalidades de crear, editar, eliminar tareas, filtros, estadísticas y cambio de temas.

## 🚀 Instalación y Ejecución

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 14 o superior)
- Navegador web moderno

### Pasos de instalación

1. **Clonar o descargar el proyecto**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd ejercicio1
   ```

2. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   ```

3. **Iniciar el servidor**
   ```bash
   npm start
   ```
   Deberías ver: "Servidor escuchando en el puerto 3000"

4. **Abrir la aplicación**
   - Abrir el archivo `frontend/index.html` en tu navegador
   - O usar un servidor local como Live Server (VS Code)

## 🎮 Funcionalidades

### ✅ Funcionalidades implementadas:
- **Crear tareas**: Escribe y presiona Enter o haz clic en "Añadir Tarea"
- **Marcar como completadas**: Haz clic en el checkbox
- **Eliminar tareas**: Haz clic en el botón 🗑️
- **Filtros**: Usa los botones "Todas", "Pendientes", "Completadas"
- **Estadísticas**: Panel con total, completadas, pendientes y progreso
- **Cambio de tema**: Botón 🌙/☀️ para cambiar entre tema claro y oscuro
- **Persistencia**: Las tareas se guardan automáticamente

### 🎨 Características visuales:
- Diseño responsive
- Tema oscuro/claro
- Animaciones suaves
- Interfaz moderna y elegante

## 🛠️ Estructura del proyecto
```
ejercicio1/
├── backend/
│   ├── server.js          # Servidor Node.js + Express
│   ├── package.json       # Configuración del proyecto
│   └── tasks.json         # Base de datos (se crea automáticamente)
├── frontend/
│   ├── index.html         # Estructura de la página
│   ├── styles.css         # Estilos y temas
│   └── app.js            # Lógica JavaScript
├── README.md              # Documentación completa
└── INSTRUCCIONES.md       # Este archivo
```

## 🔧 Tecnologías utilizadas
- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Persistencia**: Archivo JSON
- **Características**: CORS, localStorage, CSS Variables

## 🐛 Solución de problemas

### El servidor no inicia
- Verifica que Node.js esté instalado: `node --version`
- Asegúrate de estar en la carpeta `backend`
- Ejecuta `npm install` si no lo has hecho

### No se cargan las tareas
- Verifica que el servidor esté corriendo en el puerto 3000
- Abre la consola del navegador (F12) para ver errores
- Asegúrate de que no haya otro proceso usando el puerto 3000

### Problemas de CORS
- El servidor ya incluye configuración CORS
- Si persisten, verifica que estés accediendo desde `http://localhost`

## 📝 Notas de desarrollo
- Las tareas se guardan en `backend/tasks.json`
- El tema se guarda en localStorage del navegador
- El servidor debe estar corriendo para que funcione la aplicación

## 🤝 Contribuir
Si quieres mejorar el proyecto:
1. Haz un fork del repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Crea un Pull Request

## 📞 Contacto
Si tienes preguntas o problemas, abre un issue en el repositorio.

---

**¡Disfruta usando la aplicación! 🎉** 