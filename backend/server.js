const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Archivo para guardar las tareas
const tasksFile = path.join(__dirname, 'tasks.json');

// Función para cargar tareas desde el archivo
const loadTasks = () => {
    try {
        if (fs.existsSync(tasksFile)) {
            console.log('Archivo tasks.json encontrado, cargando...');
            const data = fs.readFileSync(tasksFile, 'utf8');
            const tasks = JSON.parse(data);
            console.log('Tareas cargadas del archivo:', tasks);
            return tasks;
        } else {
            console.log('Archivo tasks.json no encontrado, usando tareas por defecto');
        }
    } catch (error) {
        console.error('Error al cargar tareas:', error);
    }
    
    // Si no existe el archivo o hay error, usar tareas por defecto
    const defaultTasks = [
        { id: 1, title: 'Hacer la compra', completed: false },
        { id: 2, title: 'Estudiar Node.js', completed: true },
        { id: 3, title: 'Pasear al perro', completed: false }
    ];
    console.log('Usando tareas por defecto:', defaultTasks);
    return defaultTasks;
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

// Cargar tareas al iniciar el servidor
let tasks = loadTasks();
console.log('Tareas cargadas:', tasks);
console.log('Número de tareas:', tasks.length);
console.log('IDs de las tareas:', tasks.map(t => t.id));

// Endpoint para obtener todas las tareas
app.get('/api/tasks', (req, res) => {
    console.log('Estado actual del array tasks:', tasks);
    res.json(tasks);
});

// Endpoint para crear una nueva tarea
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

// Endpoint para actualizar una tarea (marcar como completada/pendiente)
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

// Endpoint para eliminar una tarea
app.delete('/api/tasks/:id', (req, res) => {
    console.log('Petición DELETE recibida para tarea ID:', req.params.id);
    
    const taskId = parseInt(req.params.id);
    console.log('ID convertido a número:', taskId);
    
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    console.log('Índice de la tarea encontrada:', taskIndex);
    
    if (taskIndex === -1) {
        console.log('Tarea no encontrada');
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    // Eliminar la tarea del array
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    console.log('Tarea eliminada:', deletedTask);
    saveTasks(tasks);
    res.json({ message: 'Tarea eliminada correctamente', deletedTask });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
}); 