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

Organización **por capas**: cada carpeta es una capa de MVVM y dentro de ella hay un archivo por módulo.

```
src/
├─ app/                      VIEW · pantallas (Expo Router: la ruta del archivo es la URL)
│  ├─ _layout.tsx            Navegador raíz y carga de la fuente RetroTech
│  ├─ index.tsx              Casa / HUD principal (M01)
│  ├─ area1_jugabilidad/     habitos/ (M02) · looks-vestidor/ y perfil/ (M01) · misiones/ (M03)
│  └─ area2_economia/        tienda/ (M04) · logros/ (M05) · animo/ (M06)
├─ components/               VIEW · piezas visuales reutilizables
│  ├─ ui/                    Compartidas: BottomNav, PixelIcons, ComingSoon
│  └─ misiones/ tienda/ animo/   Propias de cada módulo
├─ viewmodels/               VIEWMODEL · un hook por pantalla (useXxxViewModel.ts)
├─ services/                 SERVICE · un archivo por módulo (xxxService.ts) + apiClient.ts
├─ models/                   MODEL · interfaces y tipos, sin lógica
├─ constants/                Tema global (theme.ts) y constantes por módulo (xxxTypes.ts)
└─ styles/                   Estilos por módulo (xxx.styles.ts)
```

> ⚠️ **Dentro de `src/app/` solo van pantallas.** Expo Router trata cualquier archivo ahí como una ruta, así que estilos, datos o componentes van en sus carpetas, nunca en `app/`.

### Qué hay de cada módulo

| Módulo | View (`app/`) | ViewModel | Service | Model | Constantes / estilos |
| :-- | :-- | :-- | :-- | :-- | :-- |
| M01 Casa | `index.tsx` | `useTamagotchiViewModel` | `tamagotchiService` | `Tamagotchi`, `UserProfile` | `home.styles` |
| M01 Vestidor | `looks-vestidor/` | `useWardrobeViewModel`, `useSaveLookViewModel` | `wardrobeService` | `Wardrobe` | `looks.styles` |
| M03 Misiones | `misiones/` | `useMissionBoard…`, `useFocusSession…`, `useMissionHistory…` | `missionService` | `Mission` | `missionTypes`, `missions.styles` |
| M04 Tienda | `tienda/` | `useShopShowcase…`, `useRewardCreator…`, `useInventory…` | `shopService` | `Item` | `shopTypes`, `shop.styles` |
| M06 Ánimo | `animo/` | `useMoodRegister…`, `useMoodChart…`, `useMoodJournal…` | `moodService` | `MoodLog` | `moodTypes`, `mood.styles` |
| M02 Hábitos · M05 Logros · Perfil | Pantallas "En construcción" (`ComingSoon`) | — | — | `Quest` (pendiente) | — |

### Cómo agregar o terminar una pantalla

1. **Model**: define los tipos en `src/models/` (sin lógica).
2. **Service**: en `src/services/xxxService.ts` una función por endpoint. Mientras no exista el backend, devuelve datos simulados con el endpoint real en un comentario; después solo se cambia el cuerpo por `apiClient(...)`.
3. **ViewModel**: en `src/viewmodels/useXxxViewModel.ts` maneja estados (carga, error), validaciones y deja los datos listos para mostrar.
4. **View**: en `src/app/...` la pantalla solo dibuja y llama al ViewModel (`const vm = useXxxViewModel()`). Nada de datos ni lógica dentro.
5. **Estilos y constantes**: en `src/styles/xxx.styles.ts` y `src/constants/xxxTypes.ts`, usando los colores de `theme.ts`.
6. Antes del PR corre `npx tsc --noEmit`; debe dar **0 errores**.

### Carpetas Compartidas

- **`assets/`**: Recursos estáticos como `images/` (mascotas) y `fonts/` (tipografía RetroTech).
- **`src/components/ui/`**: `BottomNav`, `PixelIcons` (todos los íconos de la app) y `ComingSoon` (pantalla temporal para rutas pendientes).
- **`src/services/apiClient.ts`**: cliente HTTP base (URL de `EXPO_PUBLIC_API_URL` en `.env` y token de sesión).

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
