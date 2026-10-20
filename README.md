# Life-RPG · App Móvil (Frontend)

Cliente móvil desarrollado en **React Native con Expo y TypeScript**. Esta aplicación funciona bajo el patrón arquitectónico **MVVM (Model-View-ViewModel)**.

**Nota importante:** El frontend es estrictamente la capa de Interfaz de Usuario (UI). No contiene reglas de negocio pesadas ni cálculos de experiencia (XP) o daño (HP); todo se obtiene y se guarda mediante peticiones a la API REST del backend en la nube.

---

## Arquitectura y Flujo de Trabajo (MVVM)

El proyecto utiliza un flujo unidireccional para garantizar la separación de responsabilidades:
**Flujo:** `View (app/)` → `ViewModel (viewmodels/)` → `Service (services/)` → `Backend API`.

| Capa          | Carpeta                        | Responsabilidad                                                                                                                                                         |
| :------------ | :----------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Model**     | `src/models/`                  | Interfaces y Tipos de TypeScript (ej. `Tamagotchi.ts`, `Quest.ts`). Definen la forma de los datos, **no contienen lógica**.                                             |
| **View**      | `src/app/` y `src/components/` | Pantallas (basadas en Expo Router) y componentes visuales reutilizables. Solo se encargan de pintar la UI e invocar los métodos del ViewModel.                          |
| **ViewModel** | `src/viewmodels/`              | Custom Hooks de React (ej. `useTamagotchiViewModel.ts`). Contienen la lógica de presentación, manejan los estados locales (carga, error) y piden datos a los servicios. |
| **Service**   | `src/services/`                | Funciones que hacen las peticiones HTTP (`GET`, `POST`, etc.) a los endpoints del backend en C# (ej. `apiClient.ts`).                                                   |

---

## Estructura de Carpetas

### Rutas de la Aplicación (Expo Router)

Las pantallas se organizan físicamente por el área de impacto en la carpeta `src/app/`:

- `(area1_jugabilidad)/`: Rutas de Tamagotchi, perfil, hábitos y misiones.
- `(area2_economia)/`: Rutas de tienda, logros y estado de ánimo.
- _(Las áreas 3 y 4 corresponden al cliente PWA)_.

### Carpetas Compartidas

- **`assets/`**: Recursos estáticos como `images/`, `fonts/` (ej. tipografía RetroTech) y animaciones de la mascota.
- **`src/components/`**: Componentes visuales genéricos (`ui/` como botones, modales, `BottomNav`) y específicos (`tamagotchi/`, `gamificacion/`).
- **`src/constants/`**: Archivo `theme.ts` con la paleta de colores global y modo oscuro/claro centralizado.
- **`src/styles/`**: Archivos de estilos compartidos (ej. `index.styles.ts`).
- **`src/hooks/`**: Hooks utilitarios genéricos que no son de negocio (ej. `useTheme`).

---

## División de Tareas por Módulos

El desarrollo está segmentado en 15 módulos asignados a 5 desarrolladores a lo largo de 3 Sprints (S1, S2, S3). Cada módulo debe contener estrictamente **3 pantallas o vistas diferentes**.

| Carpeta Asignada             | Módulo                                             | Responsable | Área  |
| :--------------------------- | :------------------------------------------------- | :---------- | :---- |
| `m00-usuarios-autenticacion` | Usuarios, autenticación y dispositivo              | Equipo      | Ambas |
| `m01-tamagotchi-perfil`      | Tamagotchi y perfil de usuario                     | Majo        | Móvil |
| `m02-habitos`                | Hábitos diarios (quests)                           | Majo        | Móvil |
| `m03-misiones-enfoque`       | Misiones únicas y enfoque                          | Angel       | Móvil |
| `m04-tienda`                 | Tienda de la mascota                               | Emi         | Móvil |
| `m05-logros-progresion`      | Logros y progresión                                | Mike        | Móvil |
| `m06-vitalidad`              | Vitalidad y estado de la mascota                   | Jandro      | Móvil |
| `m07-visualizador-usuarios`  | Visualizador de usuarios (Perfil Lite)             | Majo        | PWA   |
| `m08-botin`                  | Botín (regalos entre amigos / visor de evidencias) | Angel       | PWA   |
| `m09-diario-aventura`        | Diario de aventura (Dashboard Analítico)           | Angel       | PWA   |
| `m10-notificaciones`         | Notificaciones de acompañamiento (Alertas)         | Emi         | PWA   |
| `m11-resumen-progreso`       | Resumen de progreso y daño                         | Emi         | PWA   |
| `m12-retos-grupo`            | Retos y métricas de grupo (Gremios)                | Jandro      | PWA   |
| `m13-sincronizacion-red`     | Sincronización local y red                         | Mike        | PWA   |
| `m14-economia-global`        | Balanceo de economía global                        | Jandro      | PWA   |
| `m15-gestion-bd`             | Gestión de base de datos                           | Mike        | Ambas |

---

## Configuración y Arranque

Asegúrate de tener instalado Node.js. Utilizaremos `pnpm` como gestor de paquetes para mantener la coherencia con el entorno de trabajo general.

```bash
# 1. Instalar pnpm globalmente (si no lo tienes)
npm install -g pnpm

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Instalar dependencias del proyecto
pnpm install

# 4. Iniciar el servidor de desarrollo de Expo (limpiando caché)
pnpm dlx expo start -c
```

Una vez que el servidor esté corriendo, escanea el código QR con la app **Expo Go** en tu celular físico, o presiona `a` para abrir en el emulador de Android / `i` para el simulador de iOS.
