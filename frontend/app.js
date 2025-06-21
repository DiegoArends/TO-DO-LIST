// Archivo para la lógica del frontend 

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://to-do-list-back-9lbn.onrender.com/api/tasks';
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    // Variable para almacenar todas las tareas y el filtro actual
    let allTasks = [];
    let currentFilter = 'all';
    let isDarkTheme = true; // Por defecto tema oscuro
    
    // Referencias a los elementos de estadísticas
    const totalTasksElement = document.getElementById('total-tasks');
    const completedTasksElement = document.getElementById('completed-tasks');
    const pendingTasksElement = document.getElementById('pending-tasks');
    const progressPercentageElement = document.getElementById('progress-percentage');
    
    // Función para calcular y actualizar las estadísticas
    const updateStats = () => {
        const total = allTasks.length;
        const completed = allTasks.filter(task => task.completed).length;
        const pending = total - completed;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        // Actualizar los elementos del DOM
        totalTasksElement.textContent = total;
        completedTasksElement.textContent = completed;
        pendingTasksElement.textContent = pending;
        progressPercentageElement.textContent = `${progress}%`;
    };
    
    // Función para renderizar las tareas en el DOM
    const renderTasks = (tasks) => {
        taskList.innerHTML = ''; // Limpiar la lista antes de renderizar
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

    // Función para obtener las tareas del backend
    const fetchTasks = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('No se pudo conectar con el servidor.');
            }
            const tasks = await response.json();
            allTasks = tasks; // Guardar todas las tareas
            applyFilter(); // Aplicar el filtro actual
            updateStats(); // Actualizar estadísticas
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
            taskList.innerHTML = '<li>Error al cargar las tareas. Asegúrate de que el servidor esté funcionando.</li>';
        }
    };

    // Función para aplicar el filtro actual
    const applyFilter = () => {
        let filteredTasks = [];
        
        switch (currentFilter) {
            case 'all':
                filteredTasks = allTasks;
                break;
            case 'pending':
                filteredTasks = allTasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = allTasks.filter(task => task.completed);
                break;
            default:
                filteredTasks = allTasks;
        }
        
        renderTasks(filteredTasks);
        updateStats(); // Actualizar estadísticas cuando se aplica un filtro
    };

    // Función para cambiar el filtro
    const changeFilter = (filter) => {
        currentFilter = filter;
        
        // Actualizar clases de los botones
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Marcar el botón seleccionado como activo
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Aplicar el filtro
        applyFilter();
    };

    // Función para añadir una nueva tarea
    const addTask = async () => {
        const title = newTaskInput.value.trim();
        
        if (!title) {
            alert('Por favor, escribe una tarea');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title })
            });

            if (!response.ok) {
                throw new Error('Error al crear la tarea');
            }

            // Limpiar el campo de texto
            newTaskInput.value = '';
            
            // Recargar la lista de tareas
            fetchTasks();
        } catch (error) {
            console.error('Error al añadir la tarea:', error);
            alert('Error al añadir la tarea. Inténtalo de nuevo.');
        }
    };

    // Función para cambiar el estado de una tarea
    const toggleTask = async (taskId, completed) => {
        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la tarea');
            }

            // Actualizar la tarea en el array local
            const taskIndex = allTasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                allTasks[taskIndex].completed = completed;
            }

            // Aplicar el filtro actual
            applyFilter();
            updateStats(); // Actualizar estadísticas después de cambiar el estado
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            alert('Error al actualizar la tarea. Inténtalo de nuevo.');
        }
    };

    // Función para eliminar una tarea
    const deleteTask = async (taskId) => {
        // Confirmar antes de eliminar
        if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la tarea');
            }

            // Eliminar la tarea del array local
            allTasks = allTasks.filter(task => task.id !== taskId);

            // Aplicar el filtro actual
            applyFilter();
            updateStats(); // Actualizar estadísticas después de eliminar
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            alert('Error al eliminar la tarea. Inténtalo de nuevo.');
        }
    };

    // Función para cambiar el tema
    const toggleTheme = () => {
        isDarkTheme = !isDarkTheme;
        
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            themeIcon.textContent = '🌙';
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            themeIcon.textContent = '☀️';
        }
        
        // Guardar preferencia en localStorage
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    };
    
    // Función para cargar el tema guardado
    const loadTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            isDarkTheme = false;
            toggleTheme(); // Esto aplicará el tema claro
        }
    };

    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Event listener para el botón de cambio de tema
    themeToggle.addEventListener('click', toggleTheme);

    // Event listeners para los botones de filtro
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            changeFilter(filter);
        });
    });

    // Cargar tema guardado y obtener las tareas al cargar la página
    loadTheme();
    fetchTasks();
}); 