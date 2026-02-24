# 📋 Gestor de Tareas Profesional

Aplicación web moderna para la gestión eficiente de tareas diarias, con interfaz intuitiva, persistencia de datos y sistema de alertas visuales.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)

## ✨ Características Principales

### 📊 **Dashboard de Tareas**
- Visualización clara de todas las tareas en formato tabla
- Estadísticas en tiempo real (pendientes, completadas, total)
- Diseño profesional y responsive

### 🔍 **Filtrado**
- Filtros por estado: Todas | Pendientes | Completadas
- Ordenamiento múltiple: Más recientes | Más antiguas | A-Z | Z-A

### 📝 **Gestión Completa de Tareas**
- ➕ **Crear** tareas con título, descripción y categoría
- ✏️ **Editar** tareas (modal dedicado)
- ✅ **Completar** tareas
- 🔄 **Reabrir** tareas completadas
- 🗑️ **Eliminar** tareas (con confirmación)

### 🏷️ **Categorías**
- 💼 Trabajo
- 🏠 Personal
- 📚 Estudio
- ❤️ Salud

### 🔔 **Sistema de Alertas**
- Notificaciones visuales no invasivas
- Confirmaciones para acciones destructivas
- Feedback inmediato de todas las operaciones
- Alertas inteligentes (sin repeticiones)

### 💾 **Persistencia de Datos**
- Almacenamiento con JSON Server
- Datos persistentes entre sesiones
- API RESTful para operaciones CRUD

## 🚀 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| HTML5 | - | Estructura de la aplicación |
| CSS3 | - | Estilos y diseño responsive |
| JavaScript | ES6+ | Lógica de la aplicación |
| JSON Server | ^0.17.4 | API REST falsa y persistencia |
| Font Awesome | 6.0.0 | Iconografía profesional |
| Google Fonts | Inter | Tipografía moderna |

## 📁 Estructura del Proyecto
📦 gestor-tareas
├── 📄 index.html # Página principal
├── 📄 package.json # Dependencias y scripts
├── 📄 db.json # Base de datos (JSON Server)
├── 📄 README.md # Documentación
├── 📁 css/
│ ├── 📄 style.css # Estilos principales
│ └── 📄 responsive.css # Estilos responsive
└── 📁 js/
├── 📄 storage.js # Módulo de persistencia
├── 📄 tasks.js # Lógica de tareas (TaskManager)
├── 📄 alert.js # Sistema de alertas
└── 📄 app.js # Controlador principal


## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- NPM (viene con Node.js)
- Navegador web moderno

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
```bash
git clone https://github.com/ztourkmani/gestor-de-tareas.git
cd gestor-tareas
 
 ### Instalar dependencias 
 npm install

 ##Iniciar Json-server
 npx json-server --watch db.json --port 3001

 ## Abrir la aplicación
 Abre index.html en tu navegador
 O usa Live Server en VSCode

 ##Scripts disponibles
 {
  "start": "npx json-server --watch db.json --port 3001",
  "kill": "taskkill /F /IM node.exe"  // Windows: mata procesos Node
}

##📡 API Endpoints
Método	Endpoint	Descripción
GET	/tasks	Obtener todas las tareas
GET	/tasks/:id	Obtener una tarea específica
POST	/tasks	Crear nueva tarea
PUT	/tasks/:id	Actualizar tarea completa
PATCH	/tasks/:id	Actualizar parcialmente
DELETE	/tasks/:id	Eliminar tarea

## 🎨 Personalización
Colores (Variables CSS)
css
:root {
    --primary: #4361ee;
    --success: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;
    --text-dark: #1f2937;
    --text-muted: #6b7280;
    --border-color: #e5e7eb;
    --bg-light: #f9fafb;
};

##Configuración del Puerto
En js/storage.js, cambia el puerto según necesites:

javascript
const API_URL = 'http://localhost:3001/tasks';  

##🤝 Contribución
Las contribuciones son bienvenidas. Por favor:

Fork el proyecto
Crea tu rama (git checkout -b feature/AmazingFeature)
Commit tus cambios (git commit -m 'Add some AmazingFeature')
Push a la rama (git push origin feature/AmazingFeature)
Abre un Pull Request

##📝 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

##👩‍💻 Autora
Zulaima Tourkmani
📧 Email: zulaima@example.com
💼 Rol: Desarrolladora Full Stack

##🙏 Agradecimientos
Font Awesome por los increíbles iconos
Google Fonts por la tipografía Inter
La comunidad de JSON Server por esta herramienta increíble

##🐛 Solución de Problemas Comunes
Error: Puerto 3001 en uso
bash

# Solución 1: Usar otro puerto
npx json-server --watch db.json --port 3002

# Solución 2: Matar proceso existente
npm run kill  # Windows
Error: No se muestran las tareas
Verifica que json-server esté corriendo

Abre http://localhost:3001/tasks en el navegador
Confirma que db.json tenga datos
Revisa la consola del navegador (F12) para errores

##Las alertas no aparecen
Asegúrate que alert.js está incluido en index.html
Verifica que el contenedor de alertas existe en el DOM

##📈 Próximas Mejoras
Tema oscuro/claro
Exportar tareas a PDF/CSV
Fechas de vencimiento
Subtareas
Prioridades (alta/media/baja)
Etiquetas personalizadas
Compartir tareas
Modo offline con PWA

<div align="center"> <sub>Desarrollado con ❤️ para una gestión de tareas eficiente</sub> <br> <sub>© 2026 Zulaima Tourkmani - Todos los derechos reservados</sub> </div> 

