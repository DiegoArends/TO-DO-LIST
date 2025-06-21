# 📋 Proyecto: Lista de Tareas (To-Do List)

## 🎯 Descripción
Aplicación web completa de lista de tareas desarrollada con Node.js, Express, HTML, CSS y JavaScript. Permite crear, leer, actualizar y eliminar tareas con persistencia de datos en archivo JSON.

## 🏗️ Arquitectura del Proyecto
```
ejercicio1/
├── backend/
│   ├── server.js          # Servidor Node.js + Express
│   ├── package.json       # Configuración del proyecto
│   ├── tasks.json         # Base de datos (archivo JSON)
│   └── node_modules/      # Dependencias instaladas
└── frontend/
    ├── index.html         # Estructura de la página
    ├── styles.css         # Estilos y diseño
    └── app.js            # Lógica JavaScript
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js instalado en tu sistema
- Navegador web moderno

### Pasos de instalación
1. **Clonar o descargar el proyecto**
2. **Instalar dependencias del backend:**
   ```bash
   cd backend
   npm install
   ```
3. **Iniciar el servidor:**
   ```bash
   npm start
   ```
4. **Abrir el frontend:**
   - Abrir `frontend/index.html` en tu navegador
   - O usar un servidor local como Live Server

## 📚 Funcionalidades Implementadas

### ✅ Mostrar Tareas
- Carga tareas desde el backend
- Renderiza lista en el frontend
- Muestra estado (completada/pendiente)

### ✅ Crear Tareas
- Formulario para añadir nuevas tareas
- Validación de entrada
- Actualización automática de la lista

### ✅ Marcar como Completadas
- Checkboxes interactivos
- Actualización visual (texto tachado)
- Persistencia del estado

### ✅ Eliminar Tareas
- Botón de eliminar en cada tarea
- Confirmación antes de eliminar
- Actualización automática

### ✅ Persistencia de Datos
- Guarda en archivo JSON
- Carga al iniciar el servidor
- Datos se mantienen entre reinicios

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **File System (fs)**: Manejo de archivos
- **CORS**: Intercambio de recursos entre orígenes

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos y diseño responsive
- **JavaScript ES6+**: Lógica de la aplicación
- **Fetch API**: Peticiones HTTP
- **DOM Manipulation**: Interacción dinámica

## 📖 Explicación del Código

### Backend (server.js)

#### Configuración inicial
```javascript
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
```

#### Persistencia de datos
```javascript
// Archivo para guardar las tareas
const tasksFile = path.join(__dirname, 'tasks.json');

// Función para cargar tareas desde el archivo
const loadTasks = () => {
    try {
        if (fs.existsSync(tasksFile)) {
            const data = fs.readFileSync(tasksFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error al cargar tareas:', error);
    }
    
    // Tareas por defecto si no existe archivo
    return [
        { id: 1, title: 'Hacer la compra', completed: false },
        { id: 2, title: 'Estudiar Node.js', completed: true },
        { id: 3, title: 'Pasear al perro', completed: false }
    ];
};

// Función para guardar tareas en el archivo
const saveTasks = (tasks) => {
    try {
        fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
        console.log('Tareas guardadas correctamente');
    } catch (error) {
        console.error('Error al guardar tareas:', error);
    }
};
```

#### Endpoints de la API

**GET /api/tasks** - Obtener todas las tareas
```javascript
app.get('/api/tasks', (req, res) => {
    console.log('Estado actual del array tasks:', tasks);
    res.json(tasks);
});
```

**POST /api/tasks** - Crear nueva tarea
```javascript
app.post('/api/tasks', (req, res) => {
    const { title } = req.body;
    
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'El título de la tarea es requerido' });
    }
    
    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1,
        title: title.trim(),
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
});
```

**PUT /api/tasks/:id** - Actualizar tarea
```javascript
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { completed } = req.body;
    
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    tasks[taskIndex].completed = completed;
    saveTasks(tasks);
    res.json(tasks[taskIndex]);
});
```

**DELETE /api/tasks/:id** - Eliminar tarea
```javascript
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    saveTasks(tasks);
    res.json({ message: 'Tarea eliminada correctamente', deletedTask });
});
```

### Frontend (app.js)

#### Configuración inicial
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    
    // ... resto del código
});
```

#### Función para renderizar tareas
```javascript
const renderTasks = (tasks) => {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        // Crear checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.className = 'task-checkbox';
        
        // Crear span para el texto
        const taskText = document.createElement('span');
        taskText.textContent = task.title;
        taskText.className = 'task-text';
        
        // Aplicar clase completed al texto si la tarea está completada
        if (task.completed) {
            taskText.classList.add('completed');
        }
        
        // Crear botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Eliminar tarea';
        
        // Añadir event listeners
        checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        // Añadir elementos al li
        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
};
```

#### Función para obtener tareas
```javascript
const fetchTasks = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/tasks');
        if (!response.ok) {
            throw new Error('No se pudo conectar con el servidor.');
        }
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        taskList.innerHTML = '<li>Error al cargar las tareas. Asegúrate de que el servidor esté funcionando.</li>';
    }
};
```

#### Función para añadir tarea
```javascript
const addTask = async () => {
    const title = newTaskInput.value.trim();
    
    if (!title) {
        alert('Por favor, escribe una tarea');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error('Error al crear la tarea');
        }

        newTaskInput.value = '';
        fetchTasks();
    } catch (error) {
        console.error('Error al añadir la tarea:', error);
        alert('Error al añadir la tarea. Inténtalo de nuevo.');
    }
};
```

#### Función para cambiar estado de tarea
```javascript
const toggleTask = async (taskId, completed) => {
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la tarea');
        }

        fetchTasks();
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        alert('Error al actualizar la tarea. Inténtalo de nuevo.');
    }
};
```

#### Función para eliminar tarea
```javascript
const deleteTask = async (taskId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar la tarea');
        }

        fetchTasks();
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        alert('Error al eliminar la tarea. Inténtalo de nuevo.');
    }
};
```

## 🎨 Estilos CSS

### Estructura principal
```css
body {
    font-family: sans-serif;
    background-color: #f4f4f4;
    color: #333;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
}

h1 {
    color: #0d1a26;
}
```

### Formulario de añadir tareas
```css
.add-task-form {
    margin: 20px 0;
    display: flex;
    gap: 10px;
    width: 80%;
    max-width: 500px;
}

#new-task-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
}

#add-task-btn {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

#add-task-btn:hover {
    background-color: #0056b3;
}
```

### Lista de tareas
```css
#task-list {
    list-style: none;
    padding: 0;
    width: 80%;
    max-width: 500px;
}

.task-item {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 8px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 10px;
}

.task-checkbox {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.task-text {
    flex: 1;
    font-size: 16px;
}

.task-text.completed {
    text-decoration: line-through;
    color: #888;
}

.delete-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 5px;
    border-radius: 3px;
    transition: background-color 0.2s;
}

.delete-btn:hover {
    background-color: #ffebee;
}
```

## 🔍 Conceptos Clave Aprendidos

### HTTP y APIs REST
- **GET**: Obtener datos
- **POST**: Crear nuevos datos
- **PUT**: Actualizar datos existentes
- **DELETE**: Eliminar datos

### Programación Asíncrona
- Uso de `async/await` para operaciones de red
- Manejo de promesas con `fetch()`
- Control de errores con `try/catch`

### Manipulación del DOM
- Crear elementos dinámicamente
- Añadir event listeners
- Modificar clases CSS
- Actualizar contenido sin recargar

### Persistencia de Datos
- Guardar en archivos JSON
- Cargar datos al iniciar
- Sincronización entre frontend y backend

## 🛠️ Solución de Problemas

### Error 404 al eliminar tareas
**Problema**: Las tareas se perdían al reiniciar el servidor
**Solución**: Implementar persistencia con archivo JSON

### Problemas de CORS
**Problema**: El navegador bloqueaba peticiones entre frontend y backend
**Solución**: Instalar y configurar el middleware `cors`

### Validación de datos
**Problema**: Se podían crear tareas vacías
**Solución**: Validar entrada en el backend y frontend

## 🚀 Próximas Mejoras Posibles

### Funcionalidades Adicionales
1. **Filtros**: Mostrar solo completadas/pendientes
2. **Contador**: Estadísticas de tareas
3. **Edición**: Modificar texto de tareas
4. **Categorías**: Organizar tareas por categorías
5. **Fechas**: Añadir fechas límite

### Mejoras Técnicas
1. **Base de datos real**: SQLite, MongoDB
2. **Autenticación**: Sistema de usuarios
3. **Validación avanzada**: Sanitización de datos
4. **Testing**: Pruebas unitarias
5. **Deployment**: Desplegar en servidor real

## 📝 Notas de Desarrollo

### Comandos útiles
```bash
# Iniciar servidor
npm start

# Ver logs del servidor
# Los logs aparecen en la terminal donde ejecutas npm start

# Debugging en el navegador
# F12 → Console para ver errores y logs
```

### Estructura de datos
```javascript
// Formato de una tarea
{
    id: 1,                    // Identificador único
    title: "Hacer la compra", // Texto de la tarea
    completed: false          // Estado (true/false)
}
```

### Archivo de configuración
```json
// package.json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

---

## 🎓 Conclusión

Este proyecto demuestra una aplicación web completa que integra:
- **Frontend** (HTML, CSS, JavaScript)
- **Backend** (Node.js, Express)
- **Persistencia de datos** (archivo JSON)
- **API REST** completa
- **Manejo de errores** robusto

Es una excelente base para aprender desarrollo web full-stack y puede ser expandida con funcionalidades más avanzadas.

---

**Autor**: Diego  
**Fecha**: 2025  
**Tecnologías**: Node.js, Express, HTML, CSS, JavaScript 