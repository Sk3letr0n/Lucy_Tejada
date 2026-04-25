# Instituto Educativo - Sistema de Gestión Académica
## Documentación Completa del Frontend

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Características Principales](#características-principales)
4. [Tecnologías Utilizadas](#tecnologías-utilizadas)
5. [Guía de Uso](#guía-de-uso)
6. [Cuentas de Demostración](#cuentas-de-demostración)
7. [Componentes Principales](#componentes-principales)
8. [Rutas de la Aplicación](#rutas-de-la-aplicación)

---

## 🎯 Descripción General

**Instituto Educativo** es una plataforma web completa de gestión académica diseñada para instituciones educativas. Proporciona interfaces especializadas para tres tipos de usuarios: estudiantes, docentes y administradores.

### Características Clave:
- ✅ Sistema de autenticación con JWT
- ✅ Tres vistas de usuario completamente funcionales
- ✅ Dashboards estadísticos
- ✅ Gestión de calificaciones y asistencia
- ✅ Generación de reportes (PDF/Excel)
- ✅ Auditoría completa del sistema
- ✅ Diseño moderno y responsivo
- ✅ Efectos visuales educativos

---

## 📁 Estructura del Proyecto

```
educational-institute-frontend/
├── client/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx          # Barra superior
│   │   │   │   ├── Sidebar.tsx         # Navegación lateral
│   │   │   │   └── MainLayout.tsx      # Layout principal
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.tsx  # Protección de rutas
│   │   │   └── ui/                     # Componentes shadcn/ui
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx         # Contexto de autenticación
│   │   │   └── ThemeContext.tsx        # Contexto de tema
│   │   ├── hooks/
│   │   │   └── useAuth.ts              # Hook de autenticación
│   │   ├── lib/
│   │   │   ├── constants.ts            # Constantes de la app
│   │   │   ├── types.ts                # Tipos TypeScript
│   │   │   └── mockData.ts             # Datos de prueba
│   │   ├── pages/
│   │   │   ├── Login.tsx               # Página de login
│   │   │   ├── Home.tsx                # Página de inicio
│   │   │   ├── NotFound.tsx            # Página 404
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.tsx
│   │   │   │   ├── StudentGrades.tsx
│   │   │   │   ├── StudentProgress.tsx
│   │   │   │   └── StudentSchedule.tsx
│   │   │   ├── teacher/
│   │   │   │   ├── TeacherDashboard.tsx
│   │   │   │   ├── TeacherGrades.tsx
│   │   │   │   ├── TeacherAttendance.tsx
│   │   │   │   ├── TeacherAnalytics.tsx
│   │   │   │   ├── TeacherReports.tsx
│   │   │   │   └── TeacherSchedule.tsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── AdminStudents.tsx
│   │   │       ├── AdminTeachers.tsx
│   │   │       ├── AdminSubjects.tsx
│   │   │       ├── AdminSchedule.tsx
│   │   │       └── AdminAudit.tsx
│   │   ├── App.tsx                     # Componente raíz
│   │   ├── main.tsx                    # Punto de entrada
│   │   └── index.css                   # Estilos globales
│   ├── index.html                      # HTML principal
│   └── vite.config.ts                  # Configuración Vite
├── package.json
├── tsconfig.json
└── README.md
```

---

## ✨ Características Principales

### 👨‍🎓 Vista de Estudiante
- **Dashboard**: Resumen de notas, asistencia, progreso
- **Calificaciones**: Tabla detallada de notas por asignatura
- **Progreso Académico**: Gráficos de desempeño con tendencias
- **Horario**: Clases semanales con detalles (aula, docente, hora)

### 👨‍🏫 Vista de Docente
- **Dashboard**: Resumen de clase y próximas clases
- **Calificaciones**: Gestión completa de notas (CRUD)
- **Asistencia**: Control interactivo de asistencia
- **Estadísticas**: Dashboard con análisis de desempeño
- **Reportes**: Generación de PDF/Excel
- **Horario**: Clases semanales del docente

### 👨‍💼 Vista de Administrativo
- **Dashboard**: Estadísticas globales del sistema
- **Estudiantes**: Gestión completa (CRUD)
- **Docentes**: Gestión de personal académico
- **Asignaturas**: Administración de cursos
- **Horarios**: Gestión de horarios de clases
- **Auditoría**: Registro completo de cambios y accesos

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React | 19.2.1 | Framework UI |
| Vite | 7.1.7 | Build tool |
| TypeScript | 5.6.3 | Tipado estático |
| Tailwind CSS | 4.1.14 | Estilos |
| Wouter | 3.3.5 | Enrutamiento |
| Recharts | 2.15.2 | Gráficos |
| Lucide React | 0.453.0 | Iconos |
| Zod | 4.1.12 | Validación |
| Sonner | 2.0.7 | Notificaciones |

---

## 📖 Guía de Uso

### Instalación y Desarrollo

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Vista previa de producción
pnpm preview
```

### Acceso a la Aplicación

1. Abre tu navegador en `http://localhost:3000`
2. Verás la página de login
3. Usa una de las cuentas de demostración (ver abajo)
4. Serás redirigido al dashboard correspondiente a tu rol

---

## 🔐 Cuentas de Demostración

### Alumno
- **Email**: `juan@example.com`
- **Contraseña**: `password123`
- **Rol**: student
- **Acceso**: Dashboard de estudiante, notas, progreso, horario

### Docente
- **Email**: `carlos@example.com`
- **Contraseña**: `password123`
- **Rol**: teacher
- **Acceso**: Dashboard docente, calificaciones, asistencia, reportes

### Administrador
- **Email**: `admin@example.com`
- **Contraseña**: `password123`
- **Rol**: admin
- **Acceso**: Panel administrativo completo, gestión de usuarios, auditoría

---

## 🧩 Componentes Principales

### Layout Components

#### Navbar
- Barra superior con logo y usuario
- Menú de notificaciones
- Opciones de usuario (perfil, logout)
- Responsivo en móvil

#### Sidebar
- Navegación lateral según rol
- Menú colapsable en móvil
- Iconos y etiquetas
- Indicador de ruta activa

#### MainLayout
- Envuelve Navbar y Sidebar
- Gestiona estado de menú móvil
- Contenedor de contenido principal

### Auth Components

#### ProtectedRoute
- Verifica autenticación
- Valida rol del usuario
- Redirige a login si es necesario
- Muestra MainLayout automáticamente

### Page Components

Cada página incluye:
- Encabezado con título y descripción
- Filtros y búsqueda (donde aplica)
- Tablas o gráficos de datos
- Tarjetas de estadísticas
- Acciones (CRUD)

---

## 🗺️ Rutas de la Aplicación

### Rutas Públicas
- `/` - Home (redirige según autenticación)
- `/login` - Página de login
- `/404` - Página no encontrada

### Rutas de Estudiante (Protegidas)
- `/student/dashboard` - Dashboard principal
- `/student/grades` - Calificaciones
- `/student/progress` - Progreso académico
- `/student/schedule` - Horario de clases

### Rutas de Docente (Protegidas)
- `/teacher/dashboard` - Dashboard principal
- `/teacher/grades` - Gestión de calificaciones
- `/teacher/attendance` - Control de asistencia
- `/teacher/analytics` - Estadísticas y análisis
- `/teacher/reports` - Generador de reportes
- `/teacher/schedule` - Horario de clases

### Rutas de Admin (Protegidas)
- `/admin/dashboard` - Dashboard global
- `/admin/students` - Gestión de estudiantes
- `/admin/teachers` - Gestión de docentes
- `/admin/subjects` - Gestión de asignaturas
- `/admin/schedule` - Gestión de horarios
- `/admin/audit` - Registro de auditoría

---

## 🎨 Diseño y Estilos

### Paleta de Colores Educativa

| Color | Hex | Uso |
|-------|-----|-----|
| Azul Académico | #1e40af | Primario |
| Verde Educativo | #10b981 | Éxito/Positivo |
| Naranja Motivador | #f97316 | Atención/Advertencia |
| Rojo | #dc2626 | Crítico/Error |
| Gris | #6b7280 | Neutro |

### Tipografía

- **Display**: Lora (headings)
- **Body**: Poppins (contenido)
- **Monospace**: Courier New (código)

### Efectos Visuales

- Gradientes suaves en cards
- Sombras elegantes
- Transiciones fluidas (0.3s)
- Hover effects interactivos
- Animaciones de carga
- Barras de progreso animadas

---

## 📊 Datos Mock

El proyecto incluye datos de prueba realistas:

- **2 Estudiantes** con información completa
- **2 Docentes** con asignaturas asignadas
- **6 Asignaturas** con detalles académicos
- **Múltiples calificaciones** ponderadas
- **Horarios semanales** completos
- **Registros de asistencia** detallados
- **Logs de auditoría** de ejemplo

---

## 🔄 Flujo de Autenticación

```
1. Usuario accede a /login
2. Ingresa email y contraseña
3. Sistema valida credenciales
4. Se genera token JWT
5. Token se almacena en localStorage
6. Usuario es redirigido a su dashboard
7. Todas las rutas verifican token
8. Si token expira, redirige a login
```

---

## 🚀 Despliegue

### Preparación para Producción

```bash
# Compilar proyecto
pnpm build

# Verificar build
pnpm preview
```

### Consideraciones de Despliegue

- Los datos son mock (en producción usar API real)
- Implementar backend para autenticación real
- Configurar CORS si es necesario
- Usar variables de entorno para URLs
- Implementar refresh tokens
- Agregar validación en servidor

---

## 📝 Notas de Desarrollo

### Estructura de Datos

#### Usuario
```typescript
interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  name: string;
}
```

#### Calificación
```typescript
interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  value: number;
  weight: number;
  type: 'quiz' | 'midterm' | 'final' | 'assignment';
  date: string;
}
```

#### Asistencia
```typescript
interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}
```

---

## 🤝 Contribución y Mejoras Futuras

### Posibles Mejoras

- [ ] Integración con API backend
- [ ] Autenticación OAuth2
- [ ] Notificaciones en tiempo real
- [ ] Chat entre usuarios
- [ ] Tareas y trabajos
- [ ] Calificación automática
- [ ] Integración de videoconferencia
- [ ] Aplicación móvil
- [ ] Soporte multiidioma
- [ ] Modo oscuro

---

## 📞 Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: Abril 2026  
**Estado**: Producción
